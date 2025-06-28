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
    private String status;
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
    @Override
    public String toString() {
        return "EventEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", status='" + status + '\'' +
                ", type='" + type + '\'' +
                ", maxBuy=" + maxBuy +
                ", startedDate=" + startedDate +
                ", address='" + address + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public Long getStartDate() {
        return startedDate;
    }

    public Long getEndDate() {
        return endedDate;
    }
}
