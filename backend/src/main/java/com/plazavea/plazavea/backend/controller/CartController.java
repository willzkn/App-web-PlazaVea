package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Cart;
import com.plazavea.plazavea.backend.model.CartItem;
import com.plazavea.plazavea.backend.model.Product;
import com.plazavea.plazavea.backend.model.User;
import com.plazavea.plazavea.backend.repository.CartRepository;
import com.plazavea.plazavea.backend.repository.CartItemRepository;
import com.plazavea.plazavea.backend.repository.ProductRepository;
import com.plazavea.plazavea.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long id) {
        Optional<Cart> cart = cartRepository.findById(id);
        return cart.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<Cart> cart = cartRepository.findByUser(user.get());
        if (cart.isEmpty()) {
            Cart newCart = new Cart(user.get());
            Cart savedCart = cartRepository.save(newCart);
            return ResponseEntity.ok(savedCart);
        }
        return ResponseEntity.ok(cart.get());
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Cart> createCartForUser(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<Cart> existingCart = cartRepository.findByUser(user.get());
        if (existingCart.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        Cart cart = new Cart(user.get());
        Cart savedCart = cartRepository.save(cart);
        return ResponseEntity.ok(savedCart);
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartItem> addItemToCart(@PathVariable Long cartId, @Valid @RequestBody CartItem cartItem) {
        Optional<Cart> cart = cartRepository.findById(cartId);
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Product> product = productRepository.findById(cartItem.getProduct().getId());
        if (product.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart.get(), product.get());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
            return ResponseEntity.ok(cartItemRepository.save(item));
        }

        cartItem.setCart(cart.get());
        cartItem.setProduct(product.get());
        CartItem savedItem = cartItemRepository.save(cartItem);
        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long cartId, @PathVariable Long itemId, @Valid @RequestBody CartItem cartItem) {
        Optional<CartItem> existingItem = cartItemRepository.findById(itemId);
        if (existingItem.isEmpty() || !existingItem.get().getCart().getId().equals(cartId)) {
            return ResponseEntity.notFound().build();
        }

        CartItem item = existingItem.get();
        item.setQuantity(cartItem.getQuantity());
        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        Optional<CartItem> item = cartItemRepository.findById(itemId);
        if (item.isEmpty() || !item.get().getCart().getId().equals(cartId)) {
            return ResponseEntity.notFound().build();
        }

        cartItemRepository.delete(item.get());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cartId}/items")
    public ResponseEntity<Void> clearCart(@PathVariable Long cartId) {
        Optional<Cart> cart = cartRepository.findById(cartId);
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        cartItemRepository.deleteByCart(cart.get());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        Optional<Cart> cart = cartRepository.findById(cartId);
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cart.get().getItems());
    }
}
