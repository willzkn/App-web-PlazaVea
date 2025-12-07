import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="plaza-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xl">P</span>
              </div>
              <span className="font-heading font-bold text-xl">Plaza Vea</span>
            </div>
            <p className="text-background/70 text-sm mb-4">
              Tu supermercado de confianza. Productos frescos, precios bajos y la mejor calidad para tu familia.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>0800-123-456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contacto@plazavea.com.pe</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Av. La Marina 2000, San Miguel, Lima</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Lun - Dom: 8:00 - 22:00</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Ofertas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Catálogo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tiendas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trabaja con nosotros</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Libro de reclamaciones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Devoluciones</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="plaza-container py-4">
          <p className="text-center text-sm text-background/50">
            © 2024 Plaza Vea. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
