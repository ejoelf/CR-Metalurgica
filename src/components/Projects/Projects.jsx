import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import PortonDoble from "../../assets/projects/PortonDoble.jpeg";
import PortonEstandar from "../../assets/projects/PortonEstandar.jpeg";
import CocheraGaleria from "../../assets/projects/CocheraGaleria.jpeg";
import Carteleria from "../../assets/projects/Carteleria.jpeg";
import "./Projects.css";

function Projects() {
  const carouselRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Porton Levadizo Doble",
      description:
        "Porton Levadizo Doble de 3 metros de ancho por 2 metros de alto, con revestimiento en madera.",
      image: PortonDoble,
    },
    {
      id: 2,
      title: "Porton Levadizo Estandar",
      description:
        "Porton Levadizo Estandar de 2.8 metros de ancho por 2.05 metros de alto, con revestimiento en aluminio.",
      image: PortonEstandar,
    },
    {
      id: 3,
      title: "Cochera Galeria",
      description:
        "Cochera Galeria de 8 metros de ancho por 5 metros de largo, con estructura metálica y chapa trapezoidal.",
      image: CocheraGaleria,
    },
    {
      id: 4,
      title: "Carteleria",
      description:
        "Cartelería realizada en chapa del 18, corte lacer e iluminación led",
      image: Carteleria,
    },
  ];

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1); // tolerancia
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => carousel.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="projects" className="projects">
      <h2>Nuestros trabajos</h2>

      <div className="projects-carousel">
        {showLeft && (
          <button
            className="carousel-btn left"
            onClick={scrollLeft}
            aria-label="Ver trabajos anteriores"
          >
            <FaChevronLeft />
          </button>
        )}

        <div className="projects-container" ref={carouselRef}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{ backgroundImage: `url(${project.image})` }}
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              aria-label={`Abrir detalle: ${project.title}`}
              onKeyDown={(e) =>
                e.key === "Enter" && setSelectedProject(project)
              }
            />
          ))}
        </div>

        {showRight && (
          <button
            className="carousel-btn right"
            onClick={scrollRight}
            aria-label="Ver trabajos siguientes"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
