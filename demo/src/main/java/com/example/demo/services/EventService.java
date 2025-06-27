package com.example.demo.services;

import com.example.demo.entities.EventEntity;

import java.util.List;
import java.util.UUID;

public interface EventService {
    List<EventEntity> getListEvent();
    EventEntity createEvent(EventEntity eventEntity);
    EventEntity updateEvent(UUID id,EventEntity eventEntity);
    EventEntity getEventById(UUID id);
}
