package com.example.demo.services.impl;

import com.example.demo.entities.EventEntity;
import com.example.demo.repositories.EventRepository;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

    @Override
    public EventEntity updateEvent(UUID id, EventEntity eventEntity) {
        EventEntity existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        // Update fields as needed
        existingEvent.setName(eventEntity.getName());
        existingEvent.setDescription(eventEntity.getDescription());
        existingEvent.setEndedDate(eventEntity.getEndedDate());
        existingEvent.setStartedDate(eventEntity.getStartedDate());
        existingEvent.setStartedTime(eventEntity.getStartedTime());
        existingEvent.setEndedTime(eventEntity.getEndedTime());
        existingEvent.setLocation(eventEntity.getLocation());
        // Add more fields if needed
        return eventRepository.save(existingEvent);
    }
}
