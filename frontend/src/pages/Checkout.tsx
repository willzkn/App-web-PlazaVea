import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Banknote, Smartphone, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";

const paymentMethods = [
  { id: "card", name: "Tarjeta de crédito/débito", icon: CreditCard },
  { id: "cash", name: "Efectivo al recibir", icon: Banknote },
  { id: "yape", name: "Yape / Plin", icon: Smartphone },
];

const Checkout = () => {
  const { items, getSubtotal, getDiscount, getCartTotal, checkout } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated && (!formData.name || !formData.email || !formData.phone)) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const paymentMethodName = paymentMethods.find((m) => m.id === selectedPayment)?.name || "";

      if (isAuthenticated && user) {
        const orderPayload = {
          user: { id: user.id },
          totalCents: Math.round(getCartTotal() * 100),
          currency: "PEN",
          paymentProvider: paymentMethodName,
          items: items.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
            unitPriceCents: Math.round(item.price * 100),
          })),
        };

        await orderService.create(orderPayload);
      }

      const receipt = checkout(paymentMethodName);

      toast({
        title: "¡Compra exitosa!",
        description: `Tu boleta ${receipt.id} ha sido generada`,
      });

      navigate("/boletas");
    } catch (error) {
      console.error("Error creando pedido", error);
      toast({
        title: "Error al registrar el pedido",
        description: "Intenta nuevamente en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }

  };

  if (items.length === 0) {
    navigate("/carrito");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="plaza-container">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/carrito">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Checkout
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Info */}
                <section className="plaza-card p-6 space-y-5">
                  <h2 className="font-heading text-xl font-bold text-foreground">Información de entrega</h2>

                  {isAuthenticated && user ? (
                    <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nombre</span>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Correo electrónico</span>
                        <span className="font-medium text-foreground break-all">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Teléfono</span>
                          <span className="font-medium text-foreground">{user.phone}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Estos datos provienen de tu cuenta. Puedes actualizarlos en el panel de administración.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Juan Pérez"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="juan@ejemplo.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="999 888 777"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Av. La Marina 2000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">Distrito</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="San Miguel"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="plaza-card p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                    Método de pago
                  </h2>
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                          selectedPayment === method.id
                            ? "border-primary bg-plaza-red-light"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            selectedPayment === method.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          )}
                        >
                          <method.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{method.name}</span>
                        {selectedPayment === method.id && (
                          <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="plaza-card p-6 sticky top-32">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                    Tu pedido
                  </h2>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x S/{item.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          S/{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>S/{getSubtotal().toFixed(2)}</span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-plaza-green">
                        <span>Descuento</span>
                        <span>-S/{getDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-plaza-green">Gratis</span>
                    </div>
                  </div>

                  <div className="border-t border-border my-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-heading font-bold text-lg">Total</span>
                    <span className="font-heading font-bold text-2xl text-primary">
                      S/{getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="plaza"
                    size="lg"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>Confirmar compra</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
