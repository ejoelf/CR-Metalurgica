import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { businessInfo } from '../../data/siteData.js';
import { projectImages } from '../../data/projectImages.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';

export default function HeroSection() {
  return (
    <section className="hero-section" style={{ '--hero-image': `url(${projectImages.cocheraGaleria})` }}>
      <div className="hero-overlay" />
      <div className="container hero-grid">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge"><ShieldCheck size={18} /> Herrería · Pintura · Obra</span>
          <h1>{businessInfo.name}</h1>
          <h2>{businessInfo.headline}</h2>
          <p>{businessInfo.description}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
              Pedir presupuesto <ArrowRight size={18} />
            </a>
            <Link className="btn btn-secondary" to="/trabajos">Ver trabajos</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <strong>CF Metal Pintura PRO</strong>
          <p>Nuevo sistema de gestión profesional preparado para presupuestos, agenda, galería y seguimiento de trabajos.</p>
          <div className="hero-card-metrics">
            <span><b>4</b> áreas de servicio</span>
            <span><b>100%</b> a medida</span>
            <span><b>PRO</b> gestión digital</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
