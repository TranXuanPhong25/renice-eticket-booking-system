package com.example.demo.repositories;

import com.example.demo.dtos.EventDTO;
import com.example.demo.entities.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
    @Query(value = "select * from events e where e.active=true", nativeQuery = true)
    List<EventEntity> findAll();
}
