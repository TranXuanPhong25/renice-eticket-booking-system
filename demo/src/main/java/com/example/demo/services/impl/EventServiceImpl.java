package com.example.demo.services.impl;

import com.example.demo.dtos.EventDTO;
import com.example.demo.entities.EventEntity;
import com.example.demo.entities.ZoneEntity;
import com.example.demo.repositories.EventRepository;
import com.example.demo.repositories.ZoneRepository;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ZoneRepository zoneRepository;

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
        existingEvent.setImage(eventEntity.getImage());
        existingEvent.setMaxBuy(eventEntity.getMaxBuy());
        existingEvent.setAddress(eventEntity.getAddress());
        existingEvent.setSold(eventEntity.getSold());
        existingEvent.setType(eventEntity.getType());
        existingEvent.setStatus(eventEntity.getStatus());
        existingEvent.setZoneMap(eventEntity.getZoneMap());
        // Add more fields if needed
        return eventRepository.save(existingEvent);
    }

    @Override
    public EventDTO getEventById(UUID id) {
        EventDTO eventDTO = new EventDTO();
        EventEntity eventEntity = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        eventDTO.setId(eventEntity.getId());
        eventDTO.setName(eventEntity.getName());
        eventDTO.setSold(eventEntity.getSold());
        eventDTO.setDescription(eventEntity.getDescription());
        eventDTO.setEndedDate(eventEntity.getEndedDate());
        eventDTO.setStartedDate(eventEntity.getStartedDate());
        eventDTO.setStartedTime(eventEntity.getStartedTime());
        eventDTO.setEndedTime(eventEntity.getEndedTime());
        eventDTO.setImage(eventEntity.getImage());
        eventDTO.setMaxBuy(eventEntity.getMaxBuy());
        eventDTO.setAddress(eventEntity.getAddress());
        eventDTO.setType(eventEntity.getType());
        eventDTO.setStatus(eventEntity.getStatus());
        eventDTO.setZoneMap(eventEntity.getZoneMap());
        List<ZoneEntity> zones = zoneRepository.getZonesOfEventId(id);
        eventDTO.setZones(zones);
        return eventDTO;

    }
}
