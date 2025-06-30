package com.example.demo.repositories;

import com.example.demo.entities.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {
    @Query(value = "select * from orders o where o.user_id = :userId", nativeQuery = true)
    List<OrderEntity> findAllByUserId(@Param("userId") UUID userId);
}
