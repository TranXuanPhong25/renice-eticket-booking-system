package com.example.demo.entities;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "events")
public class EventEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    private String name;
    private String location;
    @Column(name = "image", columnDefinition = "TEXT")
    private String image;
    private String status;
    private String type;
    private Long maxBuy;
    private Long startedDate;
    private Long endedDate;
    private String startedTime;
    private String endedTime;
    private String address;
    private String description;
    private Integer sold;
    @Override
    public String toString() {
        return "EventEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", image='" + image + '\'' +
                ", status='" + status + '\'' +
                ", type='" + type + '\'' +
                ", maxBuy=" + maxBuy +
                ", startedDate=" + startedDate +
                ", address='" + address + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
