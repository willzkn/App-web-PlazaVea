package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Receipt;
import com.plazavea.plazavea.backend.model.Order;
import com.plazavea.plazavea.backend.repository.ReceiptRepository;
import com.plazavea.plazavea.backend.repository.OrderRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "*")
public class ReceiptController {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(@PathVariable Long id) {
        return receiptRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Receipt> getReceiptByOrderId(@PathVariable Long orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return receiptRepository.findByOrder(order.get())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Receipt> createReceipt(@Valid @RequestBody Receipt receipt) {
        if (receipt.getOrder() != null && receipt.getOrder().getId() != null) {
            Optional<Order> order = orderRepository.findById(receipt.getOrder().getId());
            if (order.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            receipt.setOrder(order.get());
        }
        
        Receipt savedReceipt = receiptRepository.save(receipt);
        return ResponseEntity.ok(savedReceipt);
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<Receipt> createReceiptForOrder(@PathVariable Long orderId, @Valid @RequestBody Receipt receipt) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Receipt> existingReceipt = receiptRepository.findByOrder(order.get());
        if (existingReceipt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        receipt.setOrder(order.get());
        Receipt savedReceipt = receiptRepository.save(receipt);
        return ResponseEntity.ok(savedReceipt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receipt> updateReceipt(@PathVariable Long id, @Valid @RequestBody Receipt receiptDetails) {
        return receiptRepository.findById(id)
                .map(receipt -> {
                    receipt.setPdfUrl(receiptDetails.getPdfUrl());
                    return ResponseEntity.ok(receiptRepository.save(receipt));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        return receiptRepository.findById(id)
                .map(receipt -> {
                    receiptRepository.delete(receipt);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
