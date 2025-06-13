package com.example.demo.services;

import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.TicketCreateRequest;

import java.util.List;
import java.util.UUID;

public interface ZoneService {
    List<ZoneEntity> getAllZoneByIds(List<UUID> ticketIds);

    ZoneEntity createZone(TicketCreateRequest ticketCreateRequest);
}
