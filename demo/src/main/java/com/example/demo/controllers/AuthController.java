package com.example.demo.controllers;

import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.entities.CustomUserDetails;
import com.example.demo.entities.UserEntity;
import com.example.demo.enums.Role;
import com.example.demo.payload.AuthResponse;
import com.example.demo.payload.LoginRequest;
import com.example.demo.payload.RegisterRequest;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.CustomUserDetailsService;
import com.example.demo.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.jaas.AuthorityGranter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e){
            throw new Exception("Wrong username or password", e);
        }
        String username = loginRequest.getEmail();
        CustomUserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        String accessToken = jwtUtils.generateToken(userDetails);
        UserDetailsDTO userDetailsDTO= new UserDetailsDTO(userDetails);
        return ResponseEntity.ok(new AuthResponse(accessToken,userDetailsDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest){
        if (userRepository.existsByEmail(registerRequest.getEmail())){
            return ResponseEntity.badRequest().body("Email already exists");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(registerRequest.getEmail());
        userEntity.setPassword(
                passwordEncoder.encode(registerRequest.getPassword())
        );
        userEntity.setUsername(registerRequest.getEmail());
        userEntity.setRole(Role.USER);
        userRepository.save(userEntity);
        return ResponseEntity.ok(userEntity);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailsDTO> getCurrentUser() {
        // Get the authenticated user from the security context
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {
            UserDetailsDTO userDetailsDTO = new UserDetailsDTO(userDetails);
            return ResponseEntity.ok(userDetailsDTO);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Clear the JWT cookie
        Cookie cookie = new Cookie("access_token", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // Set max age to 0 to delete the cookie
        response.addCookie(cookie);

        // Invalidate session
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok().body(Map.of("message", "Logged out successfully"));
    }
}