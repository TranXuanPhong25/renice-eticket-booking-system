package com.example.demo.services.impl;

import com.example.demo.entities.EventEntity;
import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.TicketCreateRequest;
import com.example.demo.repositories.EventRepository;
import com.example.demo.repositories.ZoneRepository;
import com.example.demo.services.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ZoneServiceImpl implements ZoneService {
    @Autowired
    private ZoneRepository ticketRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public List<ZoneEntity> getAllZoneByIds(List<UUID> ticketIds) {
        List<ZoneEntity> tickets = ticketRepository.getAllTicketByIds(ticketIds);
        return tickets;
    }

    @Override
    public ZoneEntity createZone(TicketCreateRequest ticketCreateRequest) {
        EventEntity event = eventRepository.findById(ticketCreateRequest.getEventId()).orElseThrow(() -> new RuntimeException("Event not found"));
        ZoneEntity zoneEntity = new ZoneEntity();
        zoneEntity.setName(ticketCreateRequest.getName());
        zoneEntity.setPrice(ticketCreateRequest.getPrice());
        zoneEntity.setEvent(event);
        zoneEntity = ticketRepository.save(zoneEntity);
        return zoneEntity;
    }
}
