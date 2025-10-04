import "./Nosotros.css";
import { useState, useEffect } from "react";

function Nosotros() {
  const [current, setCurrent] = useState(0);
  const reviews = [
    {
      id: 1,
      author: "Juan Pérez",
      text: "Excelente atención y calidad en los trabajos realizados. Muy profesionales.",
    },
    {
      id: 2,
      author: "María Gómez",
      text: "Cumplieron con todo lo pactado en tiempo y forma. 100% recomendables.",
    },
    {
      id: 3,
      author: "Carlos López",
      text: "Gran trato humano y excelente terminación en los detalles de la obra.",
    },
    {
      id: 4,
      author: "Ana Rodríguez",
      text: "Los llamé para un trabajo de urgencia y respondieron rápido y con calidad.",
    },
    {
      id: 5,
      author: "Pedro Martínez",
      text: "El mejor servicio de metalúrgica en la región. Quedé muy conforme.",
    },
  ];

  // Auto-scroll cada 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section id="nosotros" className="nosotros">
      <div className="container">
        <h2>Nosotros</h2>
        <p>
          En <strong>CR Metalúrgica</strong> trabajamos desde hace más de una década brindando soluciones integrales en
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

        {/* Carrusel de reseñas */}
        <div className="reviews-carousel">
          <div
            className="reviews-track"
            style={{
              transform: `translateX(-${current * (100 / 3)}%)`,
            }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <p>"{review.text}"</p>
                <span>- {review.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Nosotros;
