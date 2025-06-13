package com.example.demo.model;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

public class SeatSelection {
    private UUID zoneId;
    private int quantity;

    public UUID getZoneId() {
        return zoneId;
    }

    public void setZoneId(UUID zoneId) {
        this.zoneId = zoneId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
