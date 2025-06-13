package com.example.demo.controllers;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.CheckoutResponse;
import com.example.demo.payload.OrderRequest;
import com.example.demo.services.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    @Autowired
    private CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody OrderEntity orderEntity){
        CheckoutResponse checkoutResponse = checkoutService.getCheckout(orderEntity);
        return ResponseEntity.ok(checkoutResponse);
    }
}
