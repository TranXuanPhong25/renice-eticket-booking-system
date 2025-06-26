package com.example.demo.dtos;

import com.example.demo.entities.CustomUserDetails;
import com.example.demo.entities.UserEntity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;
@Getter
@Setter
public class UserDetailsDTO {
    private UUID id;
    private String email;
    UserDetailsDTO() {}
    public UserDetailsDTO(CustomUserDetails user) {
        this.id = user.getId();
        this.email = user.getEmail();
    }
}
