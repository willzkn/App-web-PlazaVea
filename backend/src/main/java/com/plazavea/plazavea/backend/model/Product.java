package com.plazavea.plazavea.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder los 200 caracteres")
    @Column(nullable = false)
    private String name;
    
    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres")
    private String description;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Size(max = 500, message = "La URL de la imagen no puede exceder los 500 caracteres")
    private String image;
    
    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 100, message = "La categoría no puede exceder los 100 caracteres")
    @Column(nullable = false)
    private String category;
    
    @NotBlank(message = "La unidad es obligatoria")
    @Size(max = 20, message = "La unidad no puede exceder los 20 caracteres")
    @Column(nullable = false)
    private String unit;
    
    @NotNull(message = "El stock es obligatorio")
    @Column(nullable = false)
    private Integer stock;
    
    @Column
    private Boolean isPromo = false;
    
    @Column
    private Boolean isNew = false;
    
    @Column(precision = 5, scale = 2)
    private Integer discount;
    
    public Product() {}
    
    public Product(String name, String description, BigDecimal price, String image, 
                   String category, String unit, Integer stock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.unit = unit;
        this.stock = stock;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }
    
    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }
    
    public String getImage() {
        return image;
    }
    
    public void setImage(String image) {
        this.image = image;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getUnit() {
        return unit;
    }
    
    public void setUnit(String unit) {
        this.unit = unit;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public Boolean getIsPromo() {
        return isPromo;
    }
    
    public void setIsPromo(Boolean isPromo) {
        this.isPromo = isPromo;
    }
    
    public Boolean getIsNew() {
        return isNew;
    }
    
    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }
    
    public Integer getDiscount() {
        return discount;
    }
    
    public void setDiscount(Integer discount) {
        this.discount = discount;
    }
}
