import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <h1>
          <a href="#home" className="logo">
            CF
          </a>
        </h1>
        <ul className="nav-links">
          <li><a href="#home">Inicio</a></li>
          <li><a href="#services">Servicios</a></li>
          <li><a href="#projects">Trabajos</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
