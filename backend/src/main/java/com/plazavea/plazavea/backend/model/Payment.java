package com.plazavea.plazavea.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    @Column(nullable = false, length = 50)
    private String provider;
    
    @Column(name = "provider_payment_id", columnDefinition = "TEXT")
    private String providerPaymentId;
    
    @Column(nullable = false, length = 20)
    private String status;
    
    @Column(name = "raw_payload", columnDefinition = "JSON")
    private String rawPayload;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public Payment() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Payment(Order order, String provider, String providerPaymentId, String status, String rawPayload) {
        this.order = order;
        this.provider = provider;
        this.providerPaymentId = providerPaymentId;
        this.status = status;
        this.rawPayload = rawPayload;
        this.createdAt = LocalDateTime.now();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
    }
    
    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }
    
    public String getProviderPaymentId() {
        return providerPaymentId;
    }
    
    public void setProviderPaymentId(String providerPaymentId) {
        this.providerPaymentId = providerPaymentId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getRawPayload() {
        return rawPayload;
    }
    
    public void setRawPayload(String rawPayload) {
        this.rawPayload = rawPayload;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
