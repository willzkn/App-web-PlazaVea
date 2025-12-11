package com.plazavea.plazavea.backend.controller;

import com.plazavea.plazavea.backend.model.Payment;
import com.plazavea.plazavea.backend.model.Order;
import com.plazavea.plazavea.backend.repository.PaymentRepository;
import com.plazavea.plazavea.backend.repository.OrderRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<Payment> payment = paymentRepository.findByOrder(order.get());
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/provider/{provider}")
    public List<Payment> getPaymentsByProvider(@PathVariable String provider) {
        return paymentRepository.findByProvider(provider);
    }

    @GetMapping("/status/{status}")
    public List<Payment> getPaymentsByStatus(@PathVariable String status) {
        return paymentRepository.findByStatus(status);
    }

    @GetMapping("/provider-payment-id/{providerPaymentId}")
    public ResponseEntity<Payment> getPaymentByProviderPaymentId(@PathVariable String providerPaymentId) {
        Optional<Payment> payment = paymentRepository.findByProviderPaymentId(providerPaymentId);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) {
        if (payment.getOrder() != null && payment.getOrder().getId() != null) {
            Optional<Order> order = orderRepository.findById(payment.getOrder().getId());
            if (order.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            payment.setOrder(order.get());
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.ok(savedPayment);
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<Payment> createPaymentForOrder(@PathVariable Long orderId, @Valid @RequestBody Payment payment) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Payment> existingPayment = paymentRepository.findByOrder(order.get());
        if (existingPayment.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        payment.setOrder(order.get());
        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.ok(savedPayment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @Valid @RequestBody Payment paymentDetails) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    payment.setProvider(paymentDetails.getProvider());
                    payment.setProviderPaymentId(paymentDetails.getProviderPaymentId());
                    payment.setStatus(paymentDetails.getStatus());
                    payment.setRawPayload(paymentDetails.getRawPayload());
                    return ResponseEntity.ok(paymentRepository.save(payment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    paymentRepository.delete(payment);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
