package com.example.demo.services.impl;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.CheckoutResponse;
import com.example.demo.services.CheckoutService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final HttpServletRequest request;

    @Autowired
    public CheckoutServiceImpl(HttpServletRequest request) {
        this.request = request;
    }

    @Override
    public CheckoutResponse getCheckout(OrderEntity orderEntity) {
        CheckoutResponse response = new CheckoutResponse();
        return response;
    }
}
