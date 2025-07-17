package com.example.demo.payload;


import com.example.demo.model.SeatSelection;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class OrderRequest {
    private String customerName;
    private String customerEmail;
    private Long totalAmount;
    private List<SeatSelection> seatSelections;
    private UUID userId;
}
