package com.plazavea.plazavea.backend.repository;

import com.plazavea.plazavea.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByReceiptId(String receiptId);
    
    boolean existsByReceiptId(String receiptId);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.date DESC")
    List<Order> findByStatusOrderByDateDesc(@Param("status") String status);
    
    @Query("SELECT o FROM Order o ORDER BY o.date DESC")
    List<Order> findAllOrderByDateDesc();
}
