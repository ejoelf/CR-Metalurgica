import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const FORM_ENDPOINT = "https://formspree.io/f/mbddjkwe";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.error ||
          "No se pudo enviar el mensaje. Probá de nuevo en unos minutos.";
        setStatus({ type: "error", msg });
        return;
      }

      setStatus({
        type: "success",
        msg: "¡Mensaje enviado! Te respondemos a la brevedad.",
      });

      form.reset();
    } catch {
      setStatus({
        type: "error",
        msg: "Error de conexión. Revisá tu internet e intentá otra vez.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <h2>Contacto</h2>

      <div className="contact-container container">
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Honeypot anti-spam (no lo ve el usuario) */}
          <input
            type="text"
            name="company"
            tabIndex="-1"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px" }}
          />

          <input type="text" name="name" placeholder="Nombre" required />
          <input type="email" name="email" placeholder="Email" required />
          <textarea name="message" placeholder="Mensaje" required />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>

          {status.msg && (
            <p className={`form-status ${status.type}`}>{status.msg}</p>
          )}
        </form>

        <div className="contact-info">
          <p>Teléfono: (0358) - 155719450</p>
          <p>Email: cesarromanisio6@gmail.com</p>
          <p>¿Dónde encontrarnos?</p>

          <iframe
            title="Ubicación CF Metal Pintura"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d366.21330387745667!2d-64.28639438422339!3d-33.0929642821964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cdfe5393651ee1%3A0x9dbd07aa672c0ef4!2sLas%20Higueras%2C%20X5805%20R%C3%ADo%20Cuarto%2C%20C%C3%B3rdoba%2C%20Argentina!5e1!3m2!1ses!2sit!4v1759479662335!5m2!1ses!2sit"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default Contact;
