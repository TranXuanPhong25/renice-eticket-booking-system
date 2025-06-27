package com.example.demo.controllers;

import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.TicketCreateRequest;
import com.example.demo.payload.ZonesCreateRequest;
import com.example.demo.payload.ZoneUpdateRequest;
import com.example.demo.services.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tickets")
public class ZoneController {

    @Autowired
    private ZoneService ticketService;

    @GetMapping("/{eventId}")
    public ResponseEntity<List<ZoneEntity>> getAllTickets(@PathVariable UUID eventId){
        System.out.println("Fetching tickets for event ID: " + eventId);
        List<ZoneEntity> tickets = ticketService.getAllZonesById(eventId);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping
    public ResponseEntity<ZoneEntity> createTicket(@RequestBody TicketCreateRequest ticketCreateRequest){
        ZoneEntity newTicket = ticketService.createZone(ticketCreateRequest);
        return ResponseEntity.ok(newTicket);
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<List<ZoneEntity>> createTicketForEvent(@PathVariable String eventId, @RequestBody ZonesCreateRequest zonesCreateRequest) {
        List<ZoneEntity> newTicket = ticketService.createZoneForEvent(eventId, zonesCreateRequest.getZones());
        return ResponseEntity.ok(newTicket);
    }

    @DeleteMapping("/{zoneId}")
    public ResponseEntity<String> deleteZone(@PathVariable UUID zoneId) {
        try {
            ticketService.deleteZone(zoneId);
            return ResponseEntity.ok("Zone deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{zoneId}")
    public ResponseEntity<ZoneEntity> updateZone(@PathVariable UUID zoneId, @RequestBody ZoneUpdateRequest zoneUpdateRequest) {
        try {
            ZoneEntity updatedZone = ticketService.updateZone(zoneId, zoneUpdateRequest);
            return ResponseEntity.ok(updatedZone);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
