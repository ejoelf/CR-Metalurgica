import { FaHammer, FaPaintRoller, FaBorderStyle, FaBolt } from "react-icons/fa";
import { Helmet } from "react-helmet";
import "./Services.css";

function Services() {
  return (
    <>
       <Helmet>
      <title>Servicios de Metalúrgica, Pintura, Durlock y Electricidad | CF Metal Pintura</title>
      <meta
        name="description"
        content="Conoce los servicios de CF Metal Pintura: metalúrgica, pintura interior y exterior, instalación de durlock y electricidad. Garantía de calidad y profesionalismo."
      />
      <meta property="og:title" content="Servicios CF Metal Pintura" />
      <meta property="og:description" content="Ofrecemos soluciones integrales en metalúrgica, pintura, durlock y electricidad." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/image/fondo.jpeg" />
    </Helmet>
   
    <section id="services" className="services">
      <div className="container">
        <h2>Nuestros Servicios</h2>
        <p className="services-subtitle">
          En CF nos especializamos en ofrecer soluciones completas y de calidad,
          combinando experiencia, dedicación y materiales de primera.
        </p>

        <div className="services-grid">
          <div className="service-card">
            <FaHammer className="service-icon" aria-label="Metalúrgica"/>
            <h3>Metalúrgica</h3>
            <p>
              Fabricación, soldadura y mantenimiento de estructuras metálicas.
              Trabajamos hierro, acero inoxidable y materiales especiales según
              la necesidad del proyecto.
            </p>
          </div>

          <div className="service-card">
            <FaPaintRoller className="service-icon" aria-label="Pintura" />
            <h3>Pintura</h3>
            <p>
              Aplicación profesional de pintura en interiores y exteriores,
              garantizando acabados duraderos, prolijos y estéticamente
              impecables.
            </p>
          </div>

          <div className="service-card">
            <FaBorderStyle className="service-icon" aria-label="Durlock"/>
            <h3>Durlock</h3>
            <p>
              Instalación de tabiques, cielorrasos y revestimientos en durlock,
              adaptándonos al diseño y funcionalidad que tu espacio requiere.
            </p>
          </div>

          <div className="service-card">
            <FaBolt className="service-icon" aria-label="Electricidad" />
            <h3>Electricidad</h3>
            <p>
              Montaje y reparación de instalaciones eléctricas seguras y
              eficientes. Cumplimos todas las normativas vigentes.
            </p>
          </div>
        </div>
      </div>
      </section>
       </>
  );
}

export default Services;
