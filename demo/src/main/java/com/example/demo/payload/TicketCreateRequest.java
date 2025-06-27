package com.example.demo.payload;


import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class TicketCreateRequest {
    private String name;
    private Long price;
    private UUID eventId;

}
