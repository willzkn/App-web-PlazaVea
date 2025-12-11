package com.plazavea.plazavea.backend.gateway;

import com.plazavea.plazavea.backend.gateway.dto.GatewayMetrics;
import com.plazavea.plazavea.backend.gateway.dto.RouteInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gateway")
@CrossOrigin(origins = "*")
public class GatewayController {

    @Autowired
    private GatewayMetricsService metricsService;

    @GetMapping("/metrics")
    public ResponseEntity<GatewayMetrics> getGatewayMetrics() {
        GatewayMetrics metrics = metricsService.getCurrentMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/routes")
    public ResponseEntity<List<RouteInfo>> getActiveRoutes() {
        List<RouteInfo> routes = metricsService.getActiveRoutes();
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now());
        health.put("services", metricsService.getServicesHealth());
        return ResponseEntity.ok(health);
    }

    @PostMapping("/record-request")
    public ResponseEntity<Void> recordRequest() {
        metricsService.recordRequest();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/record-error")
    public ResponseEntity<Void> recordError() {
        metricsService.recordError();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/record-duration")
    public ResponseEntity<Void> recordDuration(@RequestParam long duration) {
        metricsService.recordRequestDuration(duration);
        return ResponseEntity.ok().build();
    }
}
