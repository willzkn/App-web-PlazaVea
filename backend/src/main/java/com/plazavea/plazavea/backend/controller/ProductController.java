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

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/promo")
    public ResponseEntity<List<Product>> getPromoProducts() {
        List<Product> products = productRepository.findByIsPromoTrue();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/new")
    public ResponseEntity<List<Product>> getNewProducts() {
        List<Product> products = productRepository.findByIsNewTrue();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        List<Product> products;
        if (category != null && !category.isEmpty()) {
            if (search != null && !search.isEmpty()) {
                products = productRepository.findByCategoryAndSearch(category, search);
            } else {
                products = productRepository.findByCategory(category);
            }
        } else if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameOrDescriptionContaining(search);
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
        product.setPrice(productDetails.getPrice());
        product.setOriginalPrice(productDetails.getOriginalPrice());
        product.setImage(productDetails.getImage());
        product.setCategory(productDetails.getCategory());
        product.setUnit(productDetails.getUnit());
        product.setStock(productDetails.getStock());
        product.setIsPromo(productDetails.getIsPromo());
        product.setIsNew(productDetails.getIsNew());
        product.setDiscount(productDetails.getDiscount());

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

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestParam Integer stock) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        product.setStock(stock);
        Product updatedProduct = productRepository.save(product);
        
        return ResponseEntity.ok(updatedProduct);
    }
}
