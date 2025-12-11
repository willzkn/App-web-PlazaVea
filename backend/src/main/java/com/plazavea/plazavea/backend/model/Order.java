package com.plazavea.plazavea.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, length = 20)
    private String status = "pending";
    
    @Column(name = "total_cents", nullable = false)
    private Long totalCents;
    
    @Column(nullable = false, length = 10)
    private String currency = "PEN";
    
    @Column(name = "payment_provider", length = 50)
    private String paymentProvider;
    
    @Column(name = "provider_session_id", columnDefinition = "TEXT")
    private String providerSessionId;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<OrderItem> items;
    
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;
    
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Receipt receipt;
    
    public Order() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Order(User user, Long totalCents, String currency) {
        this.user = user;
        this.totalCents = totalCents;
        this.currency = currency != null ? currency : "PEN";
        this.createdAt = LocalDateTime.now();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Long getTotalCents() {
        return totalCents;
    }
    
    public void setTotalCents(Long totalCents) {
        this.totalCents = totalCents;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getPaymentProvider() {
        return paymentProvider;
    }
    
    public void setPaymentProvider(String paymentProvider) {
        this.paymentProvider = paymentProvider;
    }
    
    public String getProviderSessionId() {
        return providerSessionId;
    }
    
    public void setProviderSessionId(String providerSessionId) {
        this.providerSessionId = providerSessionId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<OrderItem> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    
    public Payment getPayment() {
        return payment;
    }
    
    public void setPayment(Payment payment) {
        this.payment = payment;
    }
    
    public Receipt getReceipt() {
        return receipt;
    }
    
    public void setReceipt(Receipt receipt) {
        this.receipt = receipt;
    }
}

