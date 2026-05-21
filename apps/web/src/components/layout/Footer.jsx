import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { cfBrandSlogan } from '../../../../../packages/branding/cfLogo.js';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import { businessInfo, services } from '../../data/siteData.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';
import { usePublicBranding } from '../../hooks/usePublicBranding.js';

export default function Footer() {
  const branding = usePublicBranding();
  const brandName = branding.publicName || branding.businessName;

  return (
    <footer className="site-footer editorial-footer">
      <div className="container editorial-footer-top">
        <div className="editorial-footer-brand">
          <span className="footer-logo-mark"><img src={branding.logoUrl} alt="Logo" /></span>
          <div>
            <strong>{brandName}</strong>
            <p>{cfBrandSlogan}</p>
          </div>
        </div>
        <a className="editorial-footer-cta" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
          Pedir presupuesto
        </a>
      </div>

      <div className="container footer-grid editorial-footer-grid">
        <div>
          <h3>Servicios</h3>
          <ul>{services.map((service) => <li key={service.slug}>{service.title}</li>)}</ul>
        </div>

        <div>
          <h3>Contacto</h3>
          <p><Phone size={16} /> {businessInfo.phone}</p>
          <p><Mail size={16} /> {businessInfo.email}</p>
          <p><MapPin size={16} /> {businessInfo.location}</p>
        </div>

        <div>
          <h3>Redes</h3>
          <div className="footer-socials editorial-socials">
            <a href={businessInfo.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
            <a href={businessInfo.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
            <a href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon size={22} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container editorial-footer-bottom">
        <span>© {new Date().getFullYear()} {brandName}</span>
        <span>Desarrollado por <a href="https://nexo-digital.tech" target="_blank" rel="noreferrer">NexoDigital</a></span>
      </div>
    </footer>
  );
}
