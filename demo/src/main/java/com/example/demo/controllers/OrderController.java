package com.example.demo.controllers;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.OrderRequest;
import com.example.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(@RequestBody OrderRequest orderRequest){
        OrderEntity orderEntity = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(orderEntity);
    }
}
