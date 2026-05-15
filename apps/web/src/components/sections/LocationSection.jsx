import { ExternalLink } from 'lucide-react';
import SectionHeader from '../common/SectionHeader.jsx';
import { businessInfo } from '../../data/siteData.js';

export default function LocationSection() {
  return (
    <section className="section location-section">
      <div className="container">
        <SectionHeader
          eyebrow="Ubicación"
          title="Trabajamos en Las Higueras, Río Cuarto y zona"
          description="Coordinamos visitas, mediciones y trabajos según la necesidad de cada proyecto."
        />

        <div className="map-card">
          <iframe
            title="Ubicación CF Metal-Pintura"
            src="https://www.google.com/maps?q=CF%20Metal%20Pintura%20Las%20Higueras%20Rio%20Cuarto%20Cordoba%20Argentina&output=embed"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-card-actions">
            <a href={businessInfo.mapsUrl} target="_blank" rel="noreferrer">
              Abrir ubicación exacta <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
