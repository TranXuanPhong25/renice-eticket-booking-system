package com.example.demo.services;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.OrderRequest;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderEntity getOrder(UUID orderId);
    OrderEntity createOrder(OrderRequest orderRequest);
    OrderEntity updateOrderStatus(UUID orderId, String status);

    List<OrderEntity> getOrdersByUserId(UUID uuid);
}
