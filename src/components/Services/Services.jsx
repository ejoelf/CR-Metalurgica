import { FaHammer, FaPaintRoller, FaBorderStyle, FaBolt } from "react-icons/fa";
import "./Services.css";

function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <h2>Nuestros Servicios</h2>
        <p className="services-subtitle">
          En CF nos especializamos en ofrecer soluciones completas y de calidad,
          combinando experiencia, dedicación y materiales de primera.
        </p>

        <div className="services-grid">
          <div className="service-card">
            <FaHammer className="service-icon" aria-hidden="true" />
            <h3>Metalúrgica</h3>
            <p>
              Fabricación, soldadura y mantenimiento de estructuras metálicas.
              Trabajamos hierro, acero inoxidable y materiales especiales según
              la necesidad del proyecto.
            </p>
          </div>

          <div className="service-card">
            <FaPaintRoller className="service-icon" aria-hidden="true" />
            <h3>Pintura</h3>
            <p>
              Aplicación profesional de pintura en interiores y exteriores,
              garantizando acabados duraderos, prolijos y estéticamente
              impecables.
            </p>
          </div>

          <div className="service-card">
            <FaBorderStyle className="service-icon" aria-hidden="true" />
            <h3>Durlock</h3>
            <p>
              Instalación de tabiques, cielorrasos y revestimientos en durlock,
              adaptándonos al diseño y funcionalidad que tu espacio requiere.
            </p>
          </div>

          <div className="service-card">
            <FaBolt className="service-icon" aria-hidden="true" />
            <h3>Electricidad</h3>
            <p>
              Montaje y reparación de instalaciones eléctricas seguras y
              eficientes. Cumplimos todas las normativas vigentes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
