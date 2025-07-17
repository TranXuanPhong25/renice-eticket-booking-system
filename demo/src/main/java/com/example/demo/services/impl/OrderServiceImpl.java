package com.example.demo.services.impl;


import com.example.demo.entities.EventEntity;
import com.example.demo.entities.OrderEntity;
import com.example.demo.entities.TicketEntity;
import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.OrderRequest;
import com.example.demo.model.SeatSelection;
import com.example.demo.repositories.EventRepository;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.TicketRepository;
import com.example.demo.repositories.ZoneRepository;
import com.example.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ZoneRepository zoneRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public OrderEntity getOrder(UUID orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public OrderEntity createOrder(OrderRequest orderRequest) {

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setCustomerName(orderRequest.getCustomerName());
        orderEntity.setCustomerEmail(orderRequest.getCustomerEmail());
        orderEntity.setTotalAmount(orderRequest.getTotalAmount());
        orderEntity.setUserId(orderRequest.getUserId());
        orderEntity.setOrderTime(new Date().getTime());
        orderEntity = orderRepository.save(orderEntity);


        List<SeatSelection> seatSelections = orderRequest.getSeatSelections();

        List<TicketEntity> newTickets = new ArrayList<>();
        for (SeatSelection seat: seatSelections) {
            for (int i = 0; i < seat.getQuantity(); i++){
                TicketEntity ticketEntity = new TicketEntity();
                ticketEntity.setAmount(seat.getAmount());
                ticketEntity.setName(orderEntity.getCustomerName());
                ticketEntity.setEmail(orderEntity.getCustomerEmail());
                ticketEntity.setOrderId(orderEntity.getId());
                ticketEntity.setZoneId(seat.getZoneId());
                newTickets.add(ticketEntity);
            }
        }

        ticketRepository.saveAll(newTickets);

        return orderEntity;
    }

    @Override
    public OrderEntity updateOrderStatus(UUID orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        List<TicketEntity> tickets = order.getTickets();
        Optional<ZoneEntity> zoneEntity = zoneRepository.findById(tickets.get(0).getZoneId());
        if(zoneEntity.isEmpty()) {
            throw new RuntimeException("Zone not found");
        }
        EventEntity eventEntity = zoneEntity.get().getEvent();
        Long sold = eventEntity.getSold()==null?0L:eventEntity.getSold();
        eventEntity.setSold((int) (sold+ tickets.size()));
        eventRepository.save(eventEntity);
        order.setOrderStatus(status);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public List<OrderEntity> getOrdersByUserId(UUID uuid) {
        return orderRepository.findAllByUserId(uuid);
    }
}
