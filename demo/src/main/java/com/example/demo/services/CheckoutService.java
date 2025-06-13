package com.example.demo.services;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.CheckoutResponse;

public interface CheckoutService {
    CheckoutResponse getCheckout(OrderEntity orderEntity);
}
