import WhatsAppIcon from './WhatsAppIcon.jsx';
import { businessInfo } from '../../data/siteData.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon size={27} />
    </a>
  );
}
