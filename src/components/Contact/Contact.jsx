import "./Contact.css";

function Contact() {
  return (
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
          <p>Teléfono: 123-456-789</p>
          <p>Email: contacto@crmetalurgica.com</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
