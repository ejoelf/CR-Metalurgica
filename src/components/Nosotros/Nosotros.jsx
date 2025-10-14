import "./Nosotros.css";
import { useState } from "react";
import { Helmet } from "react-helmet";

function Nosotros() {
  const [current, setCurrent] = useState(0);

  return (
    <>
       <Helmet>
      <title>Nosotros - CF Metal Pintura</title>
      <meta
        name="description"
        content="Conoce CF Metal Pintura: nuestra misión, visión y el equipo de profesionales que trabaja día a día para ofrecer soluciones de calidad en metalúrgica, pintura, durlock y electricidad."
      />
      <meta property="og:title" content="Nosotros - CF Metal Pintura" />
      <meta property="og:description" content="Descubre quiénes somos, nuestra misión y visión, y nuestro compromiso con la calidad y la innovación." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/image/fondo.jpeg" />
      </Helmet>
      
    <section id="nosotros" className="nosotros">
      <div className="container">
        <h2>Nosotros</h2>
        <p>
          En <strong>CF Metal Pintura</strong> trabajamos desde hace más de una década brindando soluciones integrales en
          <strong> metalúrgica, pintura, durlock y electricidad</strong>. Nuestro equipo está conformado por
          profesionales altamente capacitados que se destacan por su compromiso, responsabilidad y atención al detalle.
        </p>
        <p>
          Nuestro objetivo es acompañar a cada cliente desde la planificación hasta la ejecución del proyecto, asegurando
          un resultado final de la más alta calidad. Nos enfocamos en construir relaciones de confianza basadas en la
          transparencia, el cumplimiento de plazos y la satisfacción garantizada.
        </p>
        <p>
          Creemos en la mejora constante, por eso incorporamos nuevas tecnologías, materiales de vanguardia y
          procedimientos que nos permiten ofrecer soluciones innovadoras y duraderas.
        </p>
      </div>
      </section>
      </>
  );
}

export default Nosotros;
