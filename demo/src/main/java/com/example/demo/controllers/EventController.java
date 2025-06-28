package com.example.demo.controllers;

import com.example.demo.dtos.EventDTO;
import com.example.demo.entities.EventEntity;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventEntity>> getAllEvents(){
        return ResponseEntity.ok(eventService.getListEvent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable UUID id) {
        EventDTO event = eventService.getEventById(id);

        if(event == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(event);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<EventEntity> createEvent(@RequestBody  EventEntity eventEntity){
        EventEntity responseEntity = eventService.createEvent(eventEntity);
        return ResponseEntity.ok(responseEntity);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EventEntity> updateEvent(@PathVariable UUID id, @RequestBody EventEntity eventEntity) {
        EventEntity updatedEvent = eventService.updateEvent(id, eventEntity);
        return ResponseEntity.ok(updatedEvent);
    }
}
