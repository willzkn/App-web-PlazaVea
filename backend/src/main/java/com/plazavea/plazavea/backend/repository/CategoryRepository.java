package com.plazavea.plazavea.backend.repository;

import com.plazavea.plazavea.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    boolean existsByName(String name);
    
    List<Category> findByParentId(Long parentId);
    
    List<Category> findByParentIdIsNull();
    
    List<Category> findByParentIdOrderByName(Long parentId);
    
    List<Category> findByNameContainingIgnoreCase(String name);
}
