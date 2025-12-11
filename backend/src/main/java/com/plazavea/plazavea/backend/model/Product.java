package com.plazavea.plazavea.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Size(max = 50, message = "El SKU no puede exceder los 50 caracteres")
    @Column(unique = true, length = 50)
    private String sku;
    
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder los 200 caracteres")
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "price_cents", nullable = false)
    private Long priceCents;
    
    @Column(name = "discount_cents")
    private Long discountCents = 0L;
    
    @Column(nullable = false)
    private Integer inventory = 0;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<CartItem> cartItems;
    
    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<OrderItem> orderItems;
    
    public Product() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Product(String sku, String name, String description, Category category, 
                   Long priceCents, Long discountCents, Integer inventory, String imageUrl) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.category = category;
        this.priceCents = priceCents;
        this.discountCents = discountCents != null ? discountCents : 0L;
        this.inventory = inventory != null ? inventory : 0;
        this.imageUrl = imageUrl;
        this.createdAt = LocalDateTime.now();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSku() {
        return sku;
    }
    
    public void setSku(String sku) {
        this.sku = sku;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public Long getPriceCents() {
        return priceCents;
    }
    
    public void setPriceCents(Long priceCents) {
        this.priceCents = priceCents;
    }
    
    public Long getDiscountCents() {
        return discountCents;
    }
    
    public void setDiscountCents(Long discountCents) {
        this.discountCents = discountCents;
    }
    
    public Integer getInventory() {
        return inventory;
    }
    
    public void setInventory(Integer inventory) {
        this.inventory = inventory;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<CartItem> getCartItems() {
        return cartItems;
    }
    
    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }
    
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }
    
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
