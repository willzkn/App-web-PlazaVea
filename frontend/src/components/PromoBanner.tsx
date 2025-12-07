import { ArrowRight, Percent, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="bg-gradient-to-r from-primary to-plaza-red-dark py-8 md:py-12">
      <div className="plaza-container">
        <div className="text-center text-primary-foreground">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            ¡Ofertas Exclusivas!
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-6">
            Hasta 40% de descuento en productos seleccionados
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Envío gratis +S/100</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
              <Percent className="h-5 w-5" />
              <span className="text-sm font-medium">Ofertas diarias</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm font-medium">Pago seguro</span>
            </div>
          </div>
          <Button variant="promo" size="lg" className="group">
            Ver todas las ofertas
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
