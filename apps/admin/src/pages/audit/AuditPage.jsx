import { useEffect, useMemo, useState } from 'react';
import { FileClock, Search, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { auditService } from '../../services/auditService.js';
import { formatDateTime } from '../../utils/formatters.js';

const actionLabels = {
  create: 'Creación',
  update: 'Actualización',
  delete: 'Eliminación',
  read: 'Lectura',
  read_all: 'Lectura masiva',
  status_change: 'Cambio de estado',
  pdf_generated: 'PDF generado',
  sent: 'Enviado',
  convert_to_client: 'Convertido a cliente',
  convert_to_job: 'Convertido a trabajo',
  system_action: 'Acción interna',
};

function formatJson(value) {
  if (!value) return 'Sin datos';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function AuditPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAudit() {
    try {
      setLoading(true);
      setError('');
      const data = await auditService.list({ search, action, entityType, limit: 120 });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la auditoría');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadAudit, 250);
    return () => window.clearTimeout(timer);
  }, [search, action, entityType]);

  const actions = useMemo(() => [...new Set(items.map((item) => item.action).filter(Boolean))].sort(), [items]);
  const entities = useMemo(() => [...new Set(items.map((item) => item.entityType).filter(Boolean))].sort(), [items]);

  async function openItem(item) {
    try {
      const detail = await auditService.getById(item.id);
      setSelectedItem(detail);
    } catch (err) {
      setError(err.message || 'No se pudo abrir el registro');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Control interno"
        title="Auditoría del sistema"
        description="Historial de acciones importantes realizadas dentro del CRM: cambios, eliminaciones, conversiones, PDFs y acciones internas."
      />

      <section className="toolbar-card audit-toolbar">
        <div className="search-input">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar acción, entidad, usuario o ID" />
        </div>
        <select value={action} onChange={(event) => setAction(event.target.value)}>
          <option value="">Todas las acciones</option>
          {actions.map((item) => <option key={item} value={item}>{actionLabels[item] || item}</option>)}
        </select>
        <select value={entityType} onChange={(event) => setEntityType(event.target.value)}>
          <option value="">Todas las entidades</option>
          {entities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </section>

      {error && <p className="warning-box">{error}</p>}
      {loading && <LoadingState label="Cargando auditoría..." />}

      {!loading && !items.length && (
        <EmptyState icon={FileClock} title="No hay registros" description="Cuando el sistema registre acciones importantes aparecerán acá." />
      )}

      {!loading && items.length > 0 && (
        <section className="audit-layout">
          <div className="audit-list-card">
            {items.map((item) => (
              <button className="audit-row" key={item.id} type="button" onClick={() => openItem(item)}>
                <span className="audit-icon"><FileClock size={18} /></span>
                <span>
                  <strong>{actionLabels[item.action] || item.action}</strong>
                  <small>{item.entityType} {item.entityId ? `· ${item.entityId}` : ''}</small>
                  <em>{item.user?.name || item.user?.username || item.user?.email || 'Sistema'} · {formatDateTime(item.createdAt)}</em>
                </span>
              </button>
            ))}
          </div>

          <aside className="audit-detail-card">
            {!selectedItem ? (
              <div className="audit-empty-detail">
                <FileClock size={34} />
                <h2>Seleccioná un registro</h2>
                <p>Vas a ver usuario, fecha, entidad afectada y datos anteriores/nuevos.</p>
              </div>
            ) : (
              <article>
                <button className="audit-close" type="button" onClick={() => setSelectedItem(null)} aria-label="Cerrar detalle"><X size={18} /></button>
                <span className="audit-pill">{actionLabels[selectedItem.action] || selectedItem.action}</span>
                <h2>{selectedItem.entityType}</h2>
                <div className="audit-info-grid">
                  <span><b>Usuario</b>{selectedItem.user?.name || selectedItem.user?.username || selectedItem.user?.email || 'Sistema'}</span>
                  <span><b>Fecha</b>{formatDateTime(selectedItem.createdAt)}</span>
                  <span><b>Entidad</b>{selectedItem.entityType}</span>
                  <span><b>ID entidad</b>{selectedItem.entityId || 'Sin ID'}</span>
                  <span><b>IP</b>{selectedItem.ipAddress || 'Sin IP'}</span>
                  <span><b>Navegador</b>{selectedItem.userAgent || 'Sin user agent'}</span>
                </div>
                <div className="audit-json-grid">
                  <div>
                    <h3>Valor anterior</h3>
                    <pre>{formatJson(selectedItem.oldValue)}</pre>
                  </div>
                  <div>
                    <h3>Valor nuevo</h3>
                    <pre>{formatJson(selectedItem.newValue)}</pre>
                  </div>
                </div>
              </article>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
