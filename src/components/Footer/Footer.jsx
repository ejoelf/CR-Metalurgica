import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="social-icons" aria-label="Redes sociales">
          <a
            href="https://www.instagram.com/cesarromanisio/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>

          <a
            href="https://www.facebook.com/CesarRomanisioHig?mibextid=wwXIfr&rdid=VcOPadoqXczbBfyi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16oDw5oFz7%2F%3Fmibextid%3DwwXIfr#"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Facebook"
            title="Facebook"
          >
            <FaFacebook aria-hidden="true" />
          </a>

          <a
            href="https://wa.me/5493585719450"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
          </a>
        </div>

        <p>© {new Date().getFullYear()} CF Metal Pintura - Todos los derechos reservados</p>

        <p className="credits">
          Creada por{" "}
          <a
            href="https://nexo-digital.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="nexodigital"
          >
            NexoDigital
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
