import { Mail, MapPin, Phone, UserRound } from 'lucide-react';

export default function ClientCard({ client, onOpen }) {
  return (
    <button className="client-card" type="button" onClick={() => onOpen(client)}>
      <span className="client-card-icon"><UserRound size={22} /></span>
      <span className="client-card-main">
        <strong>{client.fullName || 'Cliente sin nombre'}</strong>
        <small>{client.phone || 'Sin teléfono'}</small>
        <span className="client-card-meta">
          <span><Mail size={14} /> {client.email || 'Sin email'}</span>
          <span><MapPin size={14} /> {client.city || client.address || 'Sin ubicación'}</span>
        </span>
      </span>
      <span className="client-card-stats">
        <em>{client.jobsCount || 0}</em>
        <small>trabajos</small>
      </span>
      <span className="client-card-contact"><Phone size={16} /></span>
    </button>
  );
}
