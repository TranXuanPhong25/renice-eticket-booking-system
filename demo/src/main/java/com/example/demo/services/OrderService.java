package com.example.demo.services;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.OrderRequest;

import java.util.UUID;

public interface OrderService {
    OrderEntity getOrder(UUID orderId);
    OrderEntity createOrder(OrderRequest orderRequest);
}
