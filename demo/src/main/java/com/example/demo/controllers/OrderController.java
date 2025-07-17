package com.example.demo.controllers;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.OrderRequest;
import com.example.demo.services.OnepayService;
import com.example.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private OnepayService onepayService;

    @GetMapping
    public ResponseEntity<List<OrderEntity>> getOrder(@RequestParam String userId) {
        List<OrderEntity> orderEntity = orderService.getOrdersByUserId(UUID.fromString(userId));
        if (orderEntity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderEntity);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable String orderId) {
        OrderEntity orderEntity = orderService.getOrder(UUID.fromString(orderId));
        if (orderEntity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderEntity);
    }
    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(@RequestBody OrderRequest orderRequest){
        OrderEntity orderEntity = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(orderEntity);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderEntity> updateOrderStatus(@PathVariable String orderId, @RequestBody String status) {
        OrderEntity updatedOrder = orderService.updateOrderStatus(UUID.fromString(orderId), onepayService.getResponseDescription(status));

        return ResponseEntity.ok(updatedOrder);
    }

}
