package com.example.demo.entities;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "events")
public class EventEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;
    @Column(columnDefinition = "TEXT")
    private String name;
    @Column(name = "image", columnDefinition = "TEXT")
    private String image;
    private boolean active;
    private String type;
    private Long maxBuy;
    private Long startedDate;
    private Long endedDate;
    private String startedTime;
    private String endedTime;
    @Column(columnDefinition = "TEXT")
    private String address;
    @Column( columnDefinition = "TEXT")
    private String description;
    private Integer sold;
    @Column(name = "zone_map", columnDefinition = "TEXT")
    private String zoneMap;


    public Long getStartDate() {
        return startedDate;
    }

    public Long getEndDate() {
        return endedDate;
    }
}
