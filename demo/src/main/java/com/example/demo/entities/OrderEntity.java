package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;
    private UUID userId;
    private String customerName;
    private String customerEmail;
    private Long orderTime;

    private Long totalAmount;

    private String orderStatus;
    private String status;

    @OneToMany(mappedBy = "orderId", cascade = CascadeType.ALL)
    private List<TicketEntity> tickets;

}
