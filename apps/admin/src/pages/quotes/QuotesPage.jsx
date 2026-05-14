import { Plus, Receipt } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useApiResource } from '../../hooks/useApiResource.js';
import { quotesService } from '../../services/resourceService.js';

const fallbackQuotes = [
  { id: '1', quoteNumber: 'P-0001', title: 'Presupuesto inicial', status: 'draft', total: 258500, client: { fullName: 'Cliente de ejemplo' }, items: [{ name: 'Estructura metálica' }, { name: 'Mano de obra' }] },
];

export default function QuotesPage() {
  const { items, loading, error } = useApiResource(quotesService, fallbackQuotes);

  return (
    <div>
      <PageHeader
        eyebrow="Comercial"
        title="Presupuestos"
        description="Creación de presupuestos con ítems, materiales, mano de obra, pintura, margen y precio final. PDF queda preparado para integraciones."
        action={<button className="primary-button"><Plus size={18} /> Nuevo presupuesto</button>}
      />

      {loading && <p className="muted">Cargando presupuestos...</p>}
      {error && <p className="warning-box">Mostrando datos de ejemplo. API: {error}</p>}

      <div className="data-grid quotes-grid">
        {items.map((quote) => (
          <article className="record-card quote-card" key={quote.id}>
            <div className="record-icon"><Receipt size={22} /></div>
            <div>
              <h3>{quote.quoteNumber} · {quote.title}</h3>
              <p>{quote.client?.fullName || 'Sin cliente'}</p>
              <span>{quote.items?.length || 0} ítems · Estado: {quote.status}</span>
            </div>
            <strong>$ {Number(quote.total || 0).toLocaleString('es-AR')}</strong>
          </article>
        ))}
      </div>

      <section className="panel-card quote-builder-preview">
        <h2>Editor preparado</h2>
        <p>Este módulo queda listo para conectar formularios de creación con materiales, mano de obra, pintura, descuento, margen y total automático.</p>
        <div className="quote-totals-preview">
          <span>Materiales</span><b>$ 0</b>
          <span>Mano de obra</span><b>$ 0</b>
          <span>Pintura</span><b>$ 0</b>
          <span>Margen</span><b>0%</b>
          <span>Total final</span><b>$ 0</b>
        </div>
      </section>
    </div>
  );
}
