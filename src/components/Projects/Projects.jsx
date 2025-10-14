import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { Helmet } from "react-helmet";
import "./Projects.css";

function Projects() {
  const carouselRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Proyecto 1",
      description: "Detalles del proyecto 1 realizado en metalúrgica.",
      image: "https://via.placeholder.com/400x250?text=Proyecto+1",
    },
    {
      id: 2,
      title: "Proyecto 2",
      description: "Detalles del proyecto 2 sobre pintura en general.",
      image: "https://via.placeholder.com/400x250?text=Proyecto+2",
    },
    {
      id: 3,
      title: "Proyecto 3",
      description: "Detalles del proyecto 3 sobre colocación de durlock.",
      image: "https://via.placeholder.com/400x250?text=Proyecto+3",
    },
    {
      id: 4,
      title: "Proyecto 4",
      description: "Detalles del proyecto 4 en electricidad general.",
      image: "https://via.placeholder.com/400x250?text=Proyecto+4",
    },
  ];

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    carousel.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <Helmet>
      <title>Trabajos realizados - CF Metal Pintura</title>
      <meta
        name="description"
        content="Descubre nuestros trabajos en metalúrgica, pintura, durlock y electricidad. Ejemplos reales de trabajos realizados con calidad garantizada."
      />
      <meta property="og:title" content="Trabajos CF Metal Pintura" />
      <meta property="og:description" content="Explora nuestros trabajos de metalúrgica, pintura, durlock y electricidad realizados para clientes satisfechos." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/image/fondo.jpeg" />
    </Helmet>
    <section id="projects" className="projects">
      <h2>Nuestros trabajos</h2>
      <div className="projects-carousel">
        {showLeft && (
          <button className="carousel-btn left" onClick={scrollLeft}>
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
            ></div>
          ))}
        </div>

        {showRight && (
          <button className="carousel-btn right" onClick={scrollRight}>
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
            >
              <FaTimes />
            </button>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.description}</p>
          </div>
        </div>
      )}
      </section>
      </>
  );
}

export default Projects;



