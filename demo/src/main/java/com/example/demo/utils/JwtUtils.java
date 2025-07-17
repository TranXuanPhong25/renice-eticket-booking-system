package com.example.demo.utils;

import com.example.demo.entities.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtUtils {
    private String SECRET_KEY = "veryveryveryverylongsecretkey12546566";

    public String generateToken(CustomUserDetails userDetails){
        UUID userId= userDetails.getId();
        return createToken(userId,userDetails.getAuthorities(), String.valueOf(userDetails.getUsername()));
    }

    public  String createToken(UUID userId,Collection<? extends GrantedAuthority>  authorities, String userName){
        System.out.println("SECRET_KEY" + SECRET_KEY);
        return Jwts.builder()
                .setSubject(userName) // Add this line to include the subject claim
                .claim("userId", userId.toString())
                .claim("authorities", authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 36* 60 * 60 * 1000))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractUserName(String accessToken) {
        return getClaims(accessToken).getSubject();
    }

    public boolean validateToken(String accessToken, UserDetails userDetails){
        String username = this.extractUserName(accessToken);
        return username.equals(userDetails.getUsername()) && !getClaims(accessToken).getExpiration().before(new Date());
    }

    public Claims getClaims(String accessToken){
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(accessToken)
                .getBody();
    }
}
