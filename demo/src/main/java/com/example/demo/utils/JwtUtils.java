package com.example.demo.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    private String SECRET_KEY = "veryveryveryverylongsecretkey12546566";

    public String generateToken(UserDetails userDetails){
        Map<String, Object> permissions = new HashMap<>();
        return createToken(permissions, userDetails.getUsername());
    }

    public  String createToken(Map<String, Object> permissions, String userName){
        System.out.println("SECRET_KEY" + SECRET_KEY);
        return Jwts.builder()
                .setClaims(permissions).setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1*60*60*1000))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractUserName(String accessToken) {
        return getClaims(accessToken).getSubject();
    }

    public boolean validateToken(String accessToken, UserDetails userDetails){
        String username = this.extractUserName(accessToken);
        if (username.equals(userDetails.getUsername()) && !getClaims(accessToken).getExpiration().before(new Date())){
            return true;
        }
        return false;
    }

    public Claims getClaims(String accessToken){
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(accessToken)
                .getBody();
    }
}
