import "./Services.css";

function Services() {
  return (
    <section id="services" className="services">
      <h2>Nuestros Servicios</h2>
      <div className="services-grid container">
        <div className="service-card">
          <h3>Metalúrgica</h3>
          <p>Trabajos en hierro, acero y estructuras metálicas.</p>
        </div>
        <div className="service-card">
          <h3>Pintura</h3>
          <p>Servicios de pintura interior y exterior.</p>
        </div>
        <div className="service-card">
          <h3>Durlock</h3>
          <p>Instalación de tabiques y revestimientos en durlock.</p>
        </div>
        <div className="service-card">
          <h3>Electricidad</h3>
          <p>Instalaciones eléctricas generales y reparaciones.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;
