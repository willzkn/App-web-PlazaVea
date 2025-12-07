package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Category;
import com.plazavea.plazavea.backend.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Category> getCategoryBySlug(@PathVariable String slug) {
        Optional<Category> category = categoryRepository.findBySlug(slug);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        if (categoryRepository.existsBySlug(category.getSlug())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody Category categoryDetails) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Category category = optionalCategory.get();
        
        if (!category.getName().equals(categoryDetails.getName()) && 
            categoryRepository.existsByName(categoryDetails.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (!category.getSlug().equals(categoryDetails.getSlug()) && 
            categoryRepository.existsBySlug(categoryDetails.getSlug())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        category.setName(categoryDetails.getName());
        category.setIcon(categoryDetails.getIcon());
        category.setSlug(categoryDetails.getSlug());

        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
