import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-hero compact-hero not-found-page">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>Página no encontrada</h1>
        <p>La sección que estás buscando no existe o fue movida.</p>
        <Link className="btn btn-primary" to="/">Volver al inicio</Link>
      </div>
    </section>
  );
}
