import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gauge, MapPin, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { businessInfo } from '../../data/siteData.js';
import { projectImages } from '../../data/projectImages.js';
import { buildWhatsAppUrl, quoteMessage } from '../../utils/whatsapp.js';

export default function HeroSection() {
  return (
    <section className="neo-hero">
      <div className="blueprint-grid" />
      <div className="container neo-hero-layout">
        <motion.div
          className="neo-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="industrial-kicker"><ShieldCheck size={18} /> Soluciones a medida · Las Higueras / Río Cuarto</span>
          <h1>Metal, pintura y obra ejecutados con precisión de taller.</h1>
          <p>
            Fabricamos, reparamos e instalamos portones, estructuras, cerramientos y terminaciones con una mirada técnica, prolija y directa.
          </p>
          <div className="neo-hero-actions">
            <a className="btn btn-primary" href={buildWhatsAppUrl(businessInfo.whatsapp, quoteMessage())} target="_blank" rel="noreferrer">
              Pedir presupuesto <ArrowRight size={18} />
            </a>
            <Link className="btn btn-secondary" to="/galeria">Ver trabajos reales</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-specimen"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="specimen-ruler top" />
          <div className="specimen-ruler left" />
          <img src={projectImages.portonDoble} alt="Portón metálico realizado por CF Metal Pintura" />
          <div className="specimen-label label-one">estructura metálica</div>
          <div className="specimen-label label-two">terminación a medida</div>
        </motion.div>

        <motion.aside
          className="technical-sheet"
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
        >
          <span className="sheet-code">CF-PRO / 001</span>
          <h2>Ficha de trabajo</h2>
          <div className="sheet-list">
            <span><Gauge size={17} /> Metalúrgica, pintura, durlock y electricidad</span>
            <span><Ruler size={17} /> Medición, fabricación e instalación</span>
            <span><MapPin size={17} /> Las Higueras, Río Cuarto y zona</span>
            <span><Sparkles size={17} /> Terminaciones prolijas y resistentes</span>
          </div>
          <div className="sheet-metrics">
            <strong>4</strong><small>áreas de servicio</small>
            <strong>100%</strong><small>a medida</small>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
