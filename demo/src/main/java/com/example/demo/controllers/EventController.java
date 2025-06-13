package com.example.demo.controllers;

import com.example.demo.entities.EventEntity;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventEntity>> getAllEvents(){
        return ResponseEntity.ok(eventService.getListEvent());
    }

    @PostMapping
    public ResponseEntity<EventEntity> createEvent(@RequestBody  EventEntity eventEntity){
        EventEntity responseEntity = eventService.createEvent(eventEntity);
        return ResponseEntity.ok(responseEntity);
    }
}
