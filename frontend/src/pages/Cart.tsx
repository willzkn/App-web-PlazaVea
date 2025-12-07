import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getSubtotal, getDiscount, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Link to="/">
              <Button variant="plaza" size="lg">
                <ArrowLeft className="h-5 w-5" />
                Explorar productos
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="plaza-container">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Mi Carrito ({items.length})
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="plaza-card p-4 flex gap-4 animate-slide-up"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-heading font-bold text-primary">
                        S/{item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          S/{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="plaza-card p-6 sticky top-32">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  Resumen de compra
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">S/{getSubtotal().toFixed(2)}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-plaza-green">
                      <span>Descuento</span>
                      <span className="font-medium">-S/{getDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-plaza-green font-medium">Gratis</span>
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
                  variant="plaza"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/checkout")}
                >
                  Proceder al pago
                </Button>

                <Link to="/" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Seguir comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
