
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content container">
        <h1>Bienvenidos a CR Metalúrgica</h1>
        <h2>Soluciones integrales para tu obra</h2>
        <p>
          Especialistas en <strong>metalúrgica</strong> y servicios de{" "}
          <strong>pintura, durlock y electricidad</strong>.
        </p>
        <Link to="/contact" className="btn btn-primary">
          Pedir presupuesto
        </Link>
      </div>
    </section>
  );
}

export default Hero;
