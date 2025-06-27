package com.example.demo.payload;

import com.example.demo.entities.ZoneEntity;
import lombok.Data;

import java.util.List;

@Data
public class ZonesCreateRequest {
   List<ZoneEntity> zones;
}
