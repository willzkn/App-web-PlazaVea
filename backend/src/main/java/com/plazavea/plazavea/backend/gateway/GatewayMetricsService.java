package com.plazavea.plazavea.backend.gateway;

import com.plazavea.plazavea.backend.gateway.dto.GatewayMetrics;
import com.plazavea.plazavea.backend.gateway.dto.ServiceStatus;
import com.plazavea.plazavea.backend.gateway.dto.RouteInfo;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class GatewayMetricsService {

    private final MeterRegistry meterRegistry;
    private final Counter requestCounter;
    private final Counter errorCounter;
    private final Timer requestTimer;

    public GatewayMetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.requestCounter = Counter.builder("gateway.requests.total")
            .description("Total number of requests")
            .register(meterRegistry);
        this.errorCounter = Counter.builder("gateway.errors.total")
            .description("Total number of errors")
            .register(meterRegistry);
        this.requestTimer = Timer.builder("gateway.request.duration")
            .description("Request duration")
            .register(meterRegistry);
    }

    public GatewayMetrics getCurrentMetrics() {
        GatewayMetrics metrics = new GatewayMetrics();
        metrics.setRequestsPerSecond(calculateRPS());
        metrics.setActiveConnections(getActiveConnections());
        metrics.setErrorRate(calculateErrorRate());
        metrics.setAvgLatency(getAverageLatency());
        metrics.setServices(getServicesStatus());
        return metrics;
    }

    public List<RouteInfo> getActiveRoutes() {
        List<RouteInfo> routes = new ArrayList<>();
        
        RouteInfo productsRoute = new RouteInfo();
        productsRoute.setPath("/api/products/**");
        productsRoute.setService("catalog-service");
        productsRoute.setMethod("GET,POST,PUT,DELETE");
        productsRoute.setEnabled(true);
        productsRoute.setRateLimit(1000);
        routes.add(productsRoute);
        
        RouteInfo authRoute = new RouteInfo();
        authRoute.setPath("/api/auth/**");
        authRoute.setService("auth-service");
        authRoute.setMethod("POST");
        authRoute.setEnabled(true);
        authRoute.setRateLimit(100);
        routes.add(authRoute);
        
        RouteInfo usersRoute = new RouteInfo();
        usersRoute.setPath("/api/users/**");
        usersRoute.setService("user-service");
        usersRoute.setMethod("GET,POST,PUT");
        usersRoute.setEnabled(true);
        usersRoute.setRateLimit(500);
        routes.add(usersRoute);
        
        RouteInfo ordersRoute = new RouteInfo();
        ordersRoute.setPath("/api/orders/**");
        ordersRoute.setService("sales-service");
        ordersRoute.setMethod("GET,POST,PUT");
        ordersRoute.setEnabled(true);
        ordersRoute.setRateLimit(200);
        routes.add(ordersRoute);
        
        return routes;
    }

    public Map<String, Object> getServicesHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("catalog-service", "UP");
        health.put("auth-service", "UP");
        health.put("user-service", "UP");
        health.put("sales-service", "UP");
        health.put("timestamp", Instant.now());
        return health;
    }

    private double calculateRPS() {
        return Math.random() * 50 + 10;
    }

    private int getActiveConnections() {
        return (int) (Math.random() * 100 + 50);
    }

    private double calculateErrorRate() {
        double totalRequests = requestCounter.count();
        double errors = errorCounter.count();
        return totalRequests > 0 ? (errors / totalRequests) * 100 : Math.random() * 2;
    }

    private double getAverageLatency() {
        return requestTimer != null ? requestTimer.mean(java.util.concurrent.TimeUnit.MILLISECONDS) : Math.random() * 100 + 20;
    }

    private List<ServiceStatus> getServicesStatus() {
        List<ServiceStatus> services = new ArrayList<>();
        
        ServiceStatus catalogService = new ServiceStatus();
        catalogService.setName("catalog-service");
        catalogService.setStatus("healthy");
        catalogService.setRequests((int) (Math.random() * 1000 + 500));
        catalogService.setLatency(Math.random() * 50 + 20);
        services.add(catalogService);
        
        ServiceStatus authService = new ServiceStatus();
        authService.setName("auth-service");
        authService.setStatus("healthy");
        authService.setRequests((int) (Math.random() * 200 + 100));
        authService.setLatency(Math.random() * 30 + 10);
        services.add(authService);
        
        ServiceStatus userService = new ServiceStatus();
        userService.setName("user-service");
        userService.setStatus("healthy");
        userService.setRequests((int) (Math.random() * 300 + 150));
        userService.setLatency(Math.random() * 40 + 15);
        services.add(userService);
        
        ServiceStatus salesService = new ServiceStatus();
        salesService.setName("sales-service");
        salesService.setStatus("healthy");
        salesService.setRequests((int) (Math.random() * 400 + 200));
        salesService.setLatency(Math.random() * 60 + 25);
        services.add(salesService);
        
        return services;
    }

    public void recordRequest() {
        requestCounter.increment();
    }

    public void recordError() {
        errorCounter.increment();
    }

    public void recordRequestDuration(long duration) {
        requestTimer.record(duration, java.util.concurrent.TimeUnit.MILLISECONDS);
    }
}
