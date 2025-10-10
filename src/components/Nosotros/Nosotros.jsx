import "./Nosotros.css";
import { useState } from "react";

function Nosotros() {
  const [current, setCurrent] = useState(0);

  return (
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
  );
}

export default Nosotros;
