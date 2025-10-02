import "./Testimonials.css";

function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <h2>Testimonios</h2>
      <div className="testimonials-grid container">
        <div className="testimonial-card">
          <p>"Excelente servicio y calidad en la metalúrgica."</p>
          <span>- Cliente 1</span>
        </div>
        <div className="testimonial-card">
          <p>"Muy recomendable, cumplieron con todo el proyecto."</p>
          <span>- Cliente 2</span>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
