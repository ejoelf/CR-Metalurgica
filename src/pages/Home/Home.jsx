import "./Home.css";
import Services from "../../components/Services/Services";
import Projects from "../../components/Projects/Projects";
import Testimonials from "../../components/Testimonials/Testimonials";
import Contact from "../../components/Contact/Contact";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenidos a CR Metalúrgica</h1>
          <h2>Soluciones integrales para tu obra</h2>
          <p>
            Especialistas en <strong>metalúrgica</strong> y servicios de{" "}
            <strong>pintura, durlock y electricidad</strong>.
          </p>
          <a href="#contact" className="btn btn-primary">
            Pedir presupuesto
          </a>
        </div>
      </section>

      <Services />
      <Projects />
      <Testimonials />
      <Contact />
    </>
  );
}

export default Home;
