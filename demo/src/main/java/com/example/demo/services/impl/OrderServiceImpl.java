package com.example.demo.services.impl;


import com.example.demo.entities.OrderEntity;
import com.example.demo.entities.TicketEntity;
import com.example.demo.payload.OrderRequest;
import com.example.demo.model.SeatSelection;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.TicketRepository;
import com.example.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public OrderEntity getOrder(UUID orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public OrderEntity createOrder(OrderRequest orderRequest) {
        Long totalAmount = 0L;

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setCustomerName(orderRequest.getCustomerName());
        orderEntity.setCustomerEmail(orderRequest.getCustomerEmail());
        orderEntity.setTotalAmount(totalAmount);
        orderEntity = orderRepository.save(orderEntity);


        List<SeatSelection> seatSelections = orderRequest.getSeatSelections();

        List<TicketEntity> newTickets = new ArrayList<>();
        for (SeatSelection seat: seatSelections) {
            for (int i = 0; i < seat.getQuantity(); i++){
                TicketEntity ticketEntity = new TicketEntity();
                ticketEntity.setName(orderEntity.getCustomerName());
                ticketEntity.setEmail(orderEntity.getCustomerEmail());
                ticketEntity.setOrder(orderEntity);
                ticketEntity.setZoneEntity(seat.getZoneId());
                newTickets.add(ticketEntity);
            }
        }

        ticketRepository.saveAll(newTickets);

        return orderEntity;
    }
}
