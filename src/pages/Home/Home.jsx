import "./Home.css";
import Services from "../../components/Services/Services";
import Projects from "../../components/Projects/Projects";
import Nosotros from "../../components/Nosotros/Nosotros";
import Contact from "../../components/Contact/Contact";

function Home() {
  return (
    <>
      <section id="home" className="home">
        <div className="home-content">
          <h1>CF Metal Pintura</h1>
          <h2>Soluciones integrales para tu obra</h2>
          <p>
            Especialistas en <strong>metalúrgica</strong>, servicios de{" "}
            <strong>pintura, durlock y electricidad</strong>.
          </p>
          <a href="#contact" className="btn btn-primary">
            Pedir Presupuesto
          </a>
        </div>
      </section>

      <Services />
      <Projects />
      <Nosotros />
      <Contact />
    </>
  );
}

export default Home;
