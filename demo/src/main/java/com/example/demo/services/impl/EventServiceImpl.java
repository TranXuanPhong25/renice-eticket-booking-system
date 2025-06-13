package com.example.demo.services.impl;

import com.example.demo.entities.EventEntity;
import com.example.demo.repositories.EventRepository;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository eventRepository;

    @Override
    public List<EventEntity> getListEvent() {
        return eventRepository.findAll();
    }

    @Override
    public EventEntity createEvent(EventEntity eventEntity) {
        return eventRepository.save(eventEntity);
    }
}
