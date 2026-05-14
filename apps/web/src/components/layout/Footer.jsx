import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { businessInfo, services } from '../../data/siteData.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">CF Metal Pintura</div>
          <p>
            Soluciones integrales para obra, herrería, pintura, durlock y electricidad.
            Trabajos a medida con atención directa y terminaciones profesionales.
          </p>
        </div>

        <div>
          <h3>Servicios</h3>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contacto</h3>
          <p><Phone size={16} /> {businessInfo.phone}</p>
          <p><Mail size={16} /> {businessInfo.email}</p>
          <p><MapPin size={16} /> {businessInfo.location}</p>
        </div>

        <div>
          <h3>Redes</h3>
          <div className="footer-socials">
            <a href={businessInfo.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
            <a href={businessInfo.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
            <a href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Phone /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} CF Metal Pintura. Todos los derechos reservados.</span>
        <span>Desarrollado por <a href="https://nexo-digital.tech" target="_blank" rel="noreferrer">NexoDigital</a></span>
      </div>
    </footer>
  );
}
