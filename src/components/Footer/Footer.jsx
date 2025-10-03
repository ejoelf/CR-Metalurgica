
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="social-icons">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://wa.me/5493585719450" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
        </div>
        <p>© {new Date().getFullYear()} CR Metalúrgica - Todos los derechos reservados</p>
        <p className="credits">
          Creada por <a href="https://nexo-digital.tech" target="_blank" rel="noopener noreferrer" className="nexodigital">NexoDigital</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
