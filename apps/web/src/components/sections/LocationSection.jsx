import SectionHeader from '../common/SectionHeader.jsx';

export default function LocationSection() {
  return (
    <section className="section location-section">
      <div className="container">
        <SectionHeader
          eyebrow="Ubicación"
          title="Trabajamos en Las Higueras, Río Cuarto y zona"
          description="Coordinamos visitas, mediciones y trabajos según la necesidad de cada proyecto."
        />

        <div className="map-card">
          <iframe
            title="Ubicación CF Metal Pintura"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d366.21330387745667!2d-64.28639438422339!3d-33.0929642821964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cdfe5393651ee1%3A0x9dbd07aa672c0ef4!2sLas%20Higueras%2C%20X5805%20R%C3%ADo%20Cuarto%2C%20C%C3%B3rdoba%2C%20Argentina!5e1!3m2!1ses!2sit!4v1759479662335!5m2!1ses!2sit"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
