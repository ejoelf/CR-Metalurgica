import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <h1>
          <a href="#home" className="logo" onClick={closeMenu}>
            CF
          </a>
        </h1>

        {/* Botón hamburguesa */}
        <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links de navegación */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="#home" onClick={closeMenu}>Inicio</a></li>
          <li><a href="#services" onClick={closeMenu}>Servicios</a></li>
          <li><a href="#projects" onClick={closeMenu}>Trabajos</a></li>
          <li><a href="#nosotros" onClick={closeMenu}>Nosotros</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
