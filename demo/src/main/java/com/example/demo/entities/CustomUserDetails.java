package com.example.demo.entities;

import lombok.Data;

@Data
public class CustomUserDetails extends UserEntity{
   public CustomUserDetails(UserEntity userEntity) {
        super.setId(userEntity.getId());
        super.setEmail(userEntity.getEmail());
        super.setUsername(userEntity.getUsername());
        super.setPassword(userEntity.getPassword());
        super.setRole(userEntity.getRole());
   }
}
