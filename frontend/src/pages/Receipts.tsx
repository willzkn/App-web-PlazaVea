import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, ChevronDown, ChevronUp, Calendar, CreditCard } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Receipts = () => {
  const { receipts } = useCart();
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);

  const toggleReceipt = (id: string) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  const downloadReceipt = (receiptId: string) => {
    // In a real app, this would generate and download a PDF
    const receipt = receipts.find((r) => r.id === receiptId);
    if (receipt) {
      const content = `
BOLETA ELECTRÓNICA
==================
${receipt.id}
Fecha: ${format(new Date(receipt.date), "dd/MM/yyyy HH:mm", { locale: es })}

PRODUCTOS:
${receipt.items.map((item) => `- ${item.name} x${item.quantity} = S/${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Subtotal: S/${receipt.subtotal.toFixed(2)}
Descuento: -S/${receipt.discount.toFixed(2)}
TOTAL: S/${receipt.total.toFixed(2)}

Método de pago: ${receipt.paymentMethod}
==================
¡Gracias por tu compra!
      `;
      
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${receipt.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

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
              Mis Boletas
            </h1>
          </div>

          {receipts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                No tienes boletas aún
              </h2>
              <p className="text-muted-foreground mb-6">
                Tus boletas aparecerán aquí después de realizar una compra
              </p>
              <Link to="/">
                <Button variant="plaza" size="lg">
                  Ir a comprar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {receipts.map((receipt) => (
                <article
                  key={receipt.id}
                  className="plaza-card overflow-hidden animate-slide-up"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleReceipt(receipt.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-heading font-semibold text-foreground">
                          {receipt.id}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(receipt.date), "dd 'de' MMMM, yyyy", {
                            locale: es,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-heading font-bold text-lg text-primary">
                          S/{receipt.total.toFixed(2)}
                        </p>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            receipt.status === "completed"
                              ? "bg-plaza-green/10 text-plaza-green"
                              : "bg-accent/20 text-accent-foreground"
                          )}
                        >
                          {receipt.status === "completed" ? "Completado" : "Pendiente"}
                        </span>
                      </div>
                      {expandedReceipt === receipt.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded content */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      expandedReceipt === receipt.id ? "max-h-[500px]" : "max-h-0"
                    )}
                  >
                    <div className="p-4 pt-0 border-t border-border">
                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {receipt.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 py-2"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.name}
                              </p>
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

                      {/* Summary */}
                      <div className="bg-secondary/50 rounded-lg p-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>S/{receipt.subtotal.toFixed(2)}</span>
                        </div>
                        {receipt.discount > 0 && (
                          <div className="flex justify-between text-plaza-green">
                            <span>Descuento</span>
                            <span>-S/{receipt.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold pt-1 border-t border-border">
                          <span>Total</span>
                          <span>S/{receipt.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Payment method */}
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span>{receipt.paymentMethod}</span>
                      </div>

                      {/* Download button */}
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => downloadReceipt(receipt.id)}
                      >
                        <Download className="h-4 w-4" />
                        Descargar boleta
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Receipts;
