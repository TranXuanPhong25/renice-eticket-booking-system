package com.example.demo.model;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;
@Data
public class SeatSelection {
    private UUID zoneId;
    private int quantity;
    private Long amount;

}
