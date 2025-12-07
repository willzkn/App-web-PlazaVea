package com.plazavea.plazavea.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El ID de la boleta es obligatorio")
    @Column(nullable = false, unique = true)
    private String receiptId;
    
    @NotNull(message = "La fecha es obligatoria")
    @Column(nullable = false)
    private LocalDateTime date;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items;
    
    @NotNull(message = "El subtotal es obligatorio")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @NotNull(message = "El descuento es obligatorio")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;
    
    @NotNull(message = "El total es obligatorio")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @NotBlank(message = "El método de pago es obligatorio")
    @Column(nullable = false)
    private String paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.COMPLETED;
    
    public Order() {}
    
    public Order(String receiptId, LocalDateTime date, BigDecimal subtotal, 
                 BigDecimal discount, BigDecimal total, String paymentMethod) {
        this.receiptId = receiptId;
        this.date = date;
        this.subtotal = subtotal;
        this.discount = discount;
        this.total = total;
        this.paymentMethod = paymentMethod;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getReceiptId() {
        return receiptId;
    }
    
    public void setReceiptId(String receiptId) {
        this.receiptId = receiptId;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    public List<OrderItem> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getDiscount() {
        return discount;
    }
    
    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}

