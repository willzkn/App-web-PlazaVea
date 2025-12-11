package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Order;
import com.plazavea.plazavea.backend.model.OrderItem;
import com.plazavea.plazavea.backend.model.Product;
import com.plazavea.plazavea.backend.model.User;
import com.plazavea.plazavea.backend.repository.OrderRepository;
import com.plazavea.plazavea.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAllOrderByCreatedAtDesc();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        Order order = new Order();
        order.setUser(orderRequest.getUser());
        order.setStatus("pending");
        order.setTotalCents(orderRequest.getTotalCents());
        order.setCurrency(orderRequest.getCurrency() != null ? orderRequest.getCurrency() : "PEN");
        order.setPaymentProvider(orderRequest.getPaymentProvider());

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            var productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Product product = productOpt.get();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPriceCents(itemRequest.getUnitPriceCents());

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, 
                                                   @RequestParam String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = optionalOrder.get();
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public static class OrderRequest {
        private User user;
        private Long totalCents;
        private String currency;
        private String paymentProvider;
        private List<OrderItemRequest> items;

        public User getUser() { return user; }
        public void setUser(User user) { this.user = user; }
        public Long getTotalCents() { return totalCents; }
        public void setTotalCents(Long totalCents) { this.totalCents = totalCents; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getPaymentProvider() { return paymentProvider; }
        public void setPaymentProvider(String paymentProvider) { this.paymentProvider = paymentProvider; }
        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }
    }

    public static class OrderItemRequest {
        private Long productId;
        private Long unitPriceCents;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Long getUnitPriceCents() { return unitPriceCents; }
        public void setUnitPriceCents(Long unitPriceCents) { this.unitPriceCents = unitPriceCents; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
