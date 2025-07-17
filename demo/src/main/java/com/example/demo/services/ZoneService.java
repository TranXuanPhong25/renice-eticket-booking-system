package com.example.demo.services;

import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.TicketCreateRequest;
import com.example.demo.payload.ZoneUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface ZoneService {
    List<ZoneEntity> getAllZoneByIds(List<UUID> ticketIds);

    ZoneEntity createZone(TicketCreateRequest ticketCreateRequest);

    List<ZoneEntity> createZoneForEvent(String eventId, List<ZoneEntity> zones);

    List<ZoneEntity> getAllZonesById(UUID eventId);

    void deleteZone(UUID zoneId);

    ZoneEntity updateZone(UUID zoneId, ZoneUpdateRequest zoneUpdateRequest);
}
