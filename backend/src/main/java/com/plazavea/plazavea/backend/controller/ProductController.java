package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Product;
import com.plazavea.plazavea.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/discount")
    public ResponseEntity<List<Product>> getDiscountProducts() {
        List<Product> products = productRepository.findByDiscountCentsGreaterThan(0L);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        List<Product> products = productRepository.findByInventoryGreaterThan(0);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        Long categoryId = null;
        try {
            categoryId = category != null ? Long.parseLong(category) : null;
        } catch (NumberFormatException e) {
            categoryId = null;
        }
        
        List<Product> products;
        if (categoryId != null) {
            if (search != null && !search.isEmpty()) {
                products = productRepository.findByCategoryAndSearch(categoryId, search);
            } else {
                products = productRepository.findByCategoryId(categoryId);
            }
        } else if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameOrDescriptionOrSkuContaining(search);
        } else {
            products = productRepository.findAll();
        }
        
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        if (productRepository.existsByName(product.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        
        if (!product.getName().equals(productDetails.getName()) && 
            productRepository.existsByName(productDetails.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setSku(productDetails.getSku());
        product.setCategory(productDetails.getCategory());
        product.setPriceCents(productDetails.getPriceCents());
        product.setDiscountCents(productDetails.getDiscountCents());
        product.setInventory(productDetails.getInventory());
        product.setImageUrl(productDetails.getImageUrl());

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/inventory")
    public ResponseEntity<Product> updateInventory(@PathVariable Long id, @RequestParam Integer inventory) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        product.setInventory(inventory);
        Product updatedProduct = productRepository.save(product);
        
        return ResponseEntity.ok(updatedProduct);
    }
}
