package com.example.demo.controllers;

import com.example.demo.entities.ZoneEntity;
import com.example.demo.payload.TicketCreateRequest;
import com.example.demo.services.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class ZoneController {

    @Autowired
    private ZoneService ticketService;

    @GetMapping
    public ResponseEntity<List<ZoneEntity>> getAllTickets(){
        return ResponseEntity.ok(null);
    }

    @PostMapping
    public ResponseEntity<ZoneEntity> createTicket(@RequestBody TicketCreateRequest ticketCreateRequest){
        ZoneEntity newTicket = ticketService.createZone(ticketCreateRequest);
        return ResponseEntity.ok(newTicket);
    }
}
