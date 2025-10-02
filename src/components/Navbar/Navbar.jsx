import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <h1>
          <Link to="/" className="logo">
            CR Metalúrgica
          </Link>
        </h1>
        <ul className="nav-links">
          <li><a href="#hero">Inicio</a></li>
          <li><a href="#services">Servicios</a></li>
          <li><a href="#projects">Portfolio</a></li>
          <li><a href="#testimonials">Testimonios</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
