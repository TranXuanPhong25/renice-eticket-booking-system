package com.example.demo.services.impl;

import com.example.demo.entities.EventEntity;
import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.TicketCreateRequest;
import com.example.demo.payload.ZoneUpdateRequest;
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
    @Autowired
    private ZoneRepository zoneRepository;

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
        
        // Set các trường mới
        if (ticketCreateRequest.getColor() != null) {
            zoneEntity.setColor(ticketCreateRequest.getColor());
        }
        if (ticketCreateRequest.getCapacity() != null) {
            zoneEntity.setCapacity(ticketCreateRequest.getCapacity());
        }
        if (ticketCreateRequest.getStatus() != null) {
            zoneEntity.setStatus(ticketCreateRequest.getStatus());
        } else {
            zoneEntity.setStatus("available"); // Default status
        }
        
        zoneEntity = ticketRepository.save(zoneEntity);
        return zoneEntity;
    }

    @Override
    public List<ZoneEntity> createZoneForEvent(String eventId, List<ZoneEntity> zones) {
        return zoneRepository.saveAll(zones);
    }

    @Override
    public List<ZoneEntity> getAllZonesById(UUID eventId) {
        return zoneRepository.getZonesOfEventId(eventId);
    }

    @Override
    public void deleteZone(UUID zoneId) {
        ZoneEntity zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found with id: " + zoneId));
        zoneRepository.delete(zone);
    }    @Override
    public ZoneEntity updateZone(UUID zoneId, ZoneUpdateRequest zoneUpdateRequest) {
        ZoneEntity zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found with id: " + zoneId));
        
        // Cập nhật tất cả các trường nếu có giá trị
        if (zoneUpdateRequest.getName() != null) {
            zone.setName(zoneUpdateRequest.getName());
        }
        if (zoneUpdateRequest.getPrice() != null) {
            zone.setPrice(zoneUpdateRequest.getPrice());
        }
        if (zoneUpdateRequest.getColor() != null) {
            zone.setColor(zoneUpdateRequest.getColor());
        }
        if (zoneUpdateRequest.getCapacity() != null) {
            zone.setCapacity(zoneUpdateRequest.getCapacity());
        }
        if (zoneUpdateRequest.getStatus() != null) {
            zone.setStatus(zoneUpdateRequest.getStatus());
        }
        
        return zoneRepository.save(zone);
    }
}
