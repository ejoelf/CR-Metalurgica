import "./Home.css";
import { Helmet } from "react-helmet";
import Services from "../../components/Services/Services";
import Projects from "../../components/Projects/Projects";
import Nosotros from "../../components/Nosotros/Nosotros";
import Contact from "../../components/Contact/Contact";

function Home() {
  return (
    <>
    <Helmet>
  <title>CF Metal Pintura - Soluciones integrales para tu obra</title>
  <meta
    name="description"
    content="CF Metal Pintura ofrece servicios profesionales de metalúrgica, pintura, durlock y electricidad. Calidad y compromiso en cada proyecto."
  />
  <meta property="og:title" content="CF Metal Pintura" />
  <meta
    property="og:description"
    content="Soluciones integrales para tu obra: metalúrgica, pintura, durlock y electricidad."
  />
  <meta property="og:type" content="website" />
        <meta property="og:image" content="/image/fondo.jpeg" />
        
  {/*<meta property="og:url" content="https://TUDOMINIO.COM/" />
<link rel="canonical" href="https://TUDOMINIO.COM/" />*/}

</Helmet>


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
