package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Order;
import com.plazavea.plazavea.backend.model.OrderItem;
import com.plazavea.plazavea.backend.model.OrderStatus;
import com.plazavea.plazavea.backend.repository.OrderRepository;
import com.plazavea.plazavea.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
        List<Order> orders = orderRepository.findAllOrderByDateDesc();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/receipt/{receiptId}")
    public ResponseEntity<Order> getOrderByReceiptId(@PathVariable String receiptId) {
        Optional<Order> order = orderRepository.findByReceiptId(receiptId);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderRepository.findByStatusOrderByDateDesc(status);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        if (orderRepository.existsByReceiptId(orderRequest.getReceiptId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Order order = new Order();
        order.setReceiptId(orderRequest.getReceiptId());
        order.setDate(LocalDateTime.now());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setStatus(OrderStatus.COMPLETED);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            var productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Product product = productOpt.get();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setPrice(itemRequest.getPrice());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setOriginalPrice(itemRequest.getOriginalPrice());

            orderItems.add(orderItem);

            BigDecimal itemSubtotal = (itemRequest.getOriginalPrice() != null ? 
                itemRequest.getOriginalPrice() : itemRequest.getPrice())
                .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            if (itemRequest.getOriginalPrice() != null) {
                BigDecimal itemDiscount = itemRequest.getOriginalPrice()
                    .subtract(itemRequest.getPrice())
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
                discount = discount.add(itemDiscount);
            }
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTotal(subtotal.subtract(discount));

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, 
                                                   @RequestParam OrderStatus status) {
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
        private String receiptId;
        private String paymentMethod;
        private List<OrderItemRequest> items;

        public String getReceiptId() { return receiptId; }
        public void setReceiptId(String receiptId) { this.receiptId = receiptId; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }
    }

    public static class OrderItemRequest {
        private Long productId;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
