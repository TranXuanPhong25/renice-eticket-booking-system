package com.example.demo.repositories;

import com.example.demo.entities.ZoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ZoneRepository extends JpaRepository<ZoneEntity, UUID> {
    @Query(value = "select * from tickets t where t.id in :ticketIds", nativeQuery = true)
    List<ZoneEntity> getAllTicketByIds(@Param("ticketIds") List<UUID> ticketIds);

    @Query(value = "select * from zones z where z.event_id = :eventId ", nativeQuery = true)
    List<ZoneEntity> getZonesOfEventId(@Param("eventId") UUID id);
}
