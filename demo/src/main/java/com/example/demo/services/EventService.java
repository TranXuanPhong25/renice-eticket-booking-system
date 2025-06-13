package com.example.demo.services;

import com.example.demo.entities.EventEntity;

import java.util.List;

public interface EventService {
    List<EventEntity> getListEvent();
    EventEntity createEvent(EventEntity eventEntity);
}
