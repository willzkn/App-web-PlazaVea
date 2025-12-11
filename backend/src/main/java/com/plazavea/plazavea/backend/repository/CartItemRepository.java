package com.plazavea.plazavea.backend.repository;

import com.plazavea.plazavea.backend.model.CartItem;
import com.plazavea.plazavea.backend.model.Cart;
import com.plazavea.plazavea.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    void deleteByCart(Cart cart);
}
