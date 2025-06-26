package com.example.demo.payload;

import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.entities.CustomUserDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    String accessToken;
    UserDetailsDTO userDetails;
}