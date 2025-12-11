package com.plazavea.plazavea.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(max = 120, message = "El nombre no puede exceder los 120 caracteres")
    @Column(nullable = false)
    private String name;
    
    @Column(name = "parent_id")
    private Long parentId;
    
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Product> products;
    
    @OneToMany(mappedBy = "parentId")
    @JsonIgnore
    private List<Category> subcategories;
    
    @ManyToOne
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Category parent;
    
    public Category() {}
    
    public Category(String name, Long parentId) {
        this.name = name;
        this.parentId = parentId;
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
    
    public Long getParentId() {
        return parentId;
    }
    
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
    
    public List<Product> getProducts() {
        return products;
    }
    
    public void setProducts(List<Product> products) {
        this.products = products;
    }
    
    public List<Category> getSubcategories() {
        return subcategories;
    }
    
    public void setSubcategories(List<Category> subcategories) {
        this.subcategories = subcategories;
    }
    
    public Category getParent() {
        return parent;
    }
    
    public void setParent(Category parent) {
        this.parent = parent;
    }
}
