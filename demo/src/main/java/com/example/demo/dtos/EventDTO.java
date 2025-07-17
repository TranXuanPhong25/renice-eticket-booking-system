package com.example.demo.dtos;

import com.example.demo.entities.EventEntity;
import com.example.demo.entities.ZoneEntity;
import lombok.Data;

import java.util.List;
@Data
public class EventDTO extends EventEntity {
    List<ZoneEntity> zones;
}
