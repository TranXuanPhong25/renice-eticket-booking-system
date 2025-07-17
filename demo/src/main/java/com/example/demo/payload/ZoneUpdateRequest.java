package com.example.demo.payload;

import lombok.Data;

import java.util.UUID;

@Data
public class ZoneUpdateRequest {
    private String name;
    private Long price;
    private String color;
    private Integer capacity;
    private String status;
}
