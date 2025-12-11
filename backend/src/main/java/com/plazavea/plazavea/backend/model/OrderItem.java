package com.plazavea.plazavea.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "order_items")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "El pedido es obligatorio")
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;
    
    @NotNull(message = "El producto es obligatorio")
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    @Column(nullable = false)
    private Integer quantity;
    
    @NotNull(message = "El precio unitario es obligatorio")
    @Column(name = "unit_price_cents", nullable = false)
    private Long unitPriceCents;
    
    public OrderItem() {}
    
    public OrderItem(Order order, Product product, Integer quantity, Long unitPriceCents) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPriceCents = unitPriceCents;
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
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Long getUnitPriceCents() {
        return unitPriceCents;
    }
    
    public void setUnitPriceCents(Long unitPriceCents) {
        this.unitPriceCents = unitPriceCents;
    }
}
