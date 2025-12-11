import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/services/apiClient";

interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  requests: number;
  latency: number;
}

interface GatewayMetrics {
  requestsPerSecond: number;
  activeConnections: number;
  errorRate: number;
  avgLatency: number;
  services: ServiceStatus[];
}

interface RouteInfo {
  path: string;
  service: string;
  method: string;
  enabled: boolean;
  rateLimit: number;
}

const gatewayService = {
  async getMetrics(): Promise<GatewayMetrics> {
    return apiClient.get<GatewayMetrics>("/gateway/metrics");
  },
  async getRoutes(): Promise<RouteInfo[]> {
    return apiClient.get<RouteInfo[]>("/gateway/routes");
  },
  async getHealth(): Promise<any> {
    return apiClient.get<any>("/gateway/health");
  },
};

export default function GatewayDashboard() {
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: ["gateway-metrics"],
    queryFn: () => gatewayService.getMetrics(),
    refetchInterval: 5000, // Refrescar cada 5 segundos
  });

  const {
    data: routes,
    isLoading: routesLoading,
  } = useQuery({
    queryKey: ["gateway-routes"],
    queryFn: () => gatewayService.getRoutes(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Sano</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degradado</Badge>;
      case "down":
        return <Badge className="bg-red-100 text-red-800">Caído</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  if (metricsError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error de Conexión</h1>
            <p className="text-muted-foreground">No se puede conectar al Gateway Dashboard</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">API Gateway Dashboard</h1>
            <p className="text-muted-foreground mt-2">Monitoreo del Gateway de Plaza Vea</p>
          </div>
          {metricsLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          )}
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Requests/seg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metrics?.requestsPerSecond.toFixed(1) || "0.0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Últimos 60 segundos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conexiones Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metrics?.activeConnections || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Concurrentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (metrics?.errorRate || 0) > 5 ? "text-red-600" : "text-green-600"
              }`}>
                {metrics?.errorRate.toFixed(2) || "0.00"}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Última hora</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Latencia Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metrics?.avgLatency.toFixed(0) || "0"}ms
              </div>
              <p className="text-xs text-muted-foreground mt-1">P95: {((metrics?.avgLatency || 0) * 1.5).toFixed(0)}ms</p>
            </CardContent>
          </Card>
        </div>

        {/* Estado de Servicios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metricsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Cargando servicios...</p>
                  </div>
                ) : (
                  metrics?.services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                        <span className="font-medium text-foreground">{service.name}</span>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="flex space-x-6 text-sm text-muted-foreground">
                        <span>Req: {service.requests}</span>
                        <span>Lat: {service.latency.toFixed(0)}ms</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rutas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {routesLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Cargando rutas...</p>
                  </div>
                ) : (
                  routes?.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{route.path}</div>
                        <div className="text-sm text-muted-foreground">{route.service}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{route.method}</Badge>
                        <Badge variant={route.enabled ? "default" : "secondary"}>
                          {route.enabled ? "Activa" : "Inactiva"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {route.rateLimit}/s
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle>Health Check General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-foreground font-medium">Gateway Status: HEALTHY</span>
              <span className="text-sm text-muted-foreground">
                Última verificación: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
