import "./Contact.css";
import { Helmet } from "react-helmet";

function Contact() {
  return (
    <>
     <Helmet>
      <title>Contacto - CF Metal Pintura</title>
      <meta
        name="description"
        content="Ponte en contacto con CF Metal Pintura. Solicita presupuestos, consultas o información sobre nuestros servicios de metalúrgica, pintura, durlock y electricidad."
      />
      <meta property="og:title" content="Contacto - CF Metal Pintura" />
      <meta property="og:description" content="Envía tu mensaje o consulta a CF Metal Pintura y recibe atención profesional y rápida." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/image/fondo.jpeg" />
    </Helmet>

    <section id="contact" className="contact">
      <h2>Contacto</h2>
      <div className="contact-container container">
        <form className="contact-form">
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Mensaje" required></textarea>
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
        <div className="contact-info">
          <p>Teléfono: (0358) - 155719450</p>
          <p>Email: contacto@crmetalurgica.com</p>
          <p>¿Dónde encontrarnos?</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d366.21330387745667!2d-64.28639438422339!3d-33.0929642821964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cdfe5393651ee1%3A0x9dbd07aa672c0ef4!2sLas%20Higueras%2C%20X5805%20R%C3%ADo%20Cuarto%2C%20C%C3%B3rdoba%2C%20Argentina!5e1!3m2!1ses!2sit!4v1759479662335!5m2!1ses!2sit"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      </section>
      </>
  );
}

export default Contact;

