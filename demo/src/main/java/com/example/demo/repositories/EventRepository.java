package com.example.demo.repositories;

import com.example.demo.dtos.EventDTO;
import com.example.demo.entities.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
}
