package com.example.demo.payload;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String orderId;
    private String eventName;
    private String againLink;
    private String amount;
}
