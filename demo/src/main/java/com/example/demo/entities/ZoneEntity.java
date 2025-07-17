package com.example.demo.entities;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;
@Data
@Entity
@Table(name = "zones")
public class ZoneEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    private String name;
    private Long price;
    private String color;
    private Integer capacity;
    private String status;


    @ManyToOne
    @JoinColumn(name = "event_id")
    private EventEntity event;


}
