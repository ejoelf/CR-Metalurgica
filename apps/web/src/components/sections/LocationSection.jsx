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
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d855.2397447717037!2d-64.28704107149335!3d-33.09287499833894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDA1JzM0LjQiUyA2NMKwMTcnMTEuMCJX!5e1!3m2!1ses!2sit!4v1778852838219!5m2!1ses!2sit"
            width="100%"
            height="450"
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
