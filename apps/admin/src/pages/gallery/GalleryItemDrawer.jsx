import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Save, Star, Trash2 } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { resolveProjectImage } from '../../data/projectImages.js';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  mainImageUrl: '',
  beforeImageUrl: '',
  afterImageUrl: '',
  isPublished: true,
  isFeatured: false,
  sortOrder: 0,
};

function toForm(item) {
  if (!item) return EMPTY_FORM;
  return {
    title: item.title || '',
    description: item.description || '',
    category: item.category || '',
    mainImageUrl: item.mainImageUrl || '',
    beforeImageUrl: item.beforeImageUrl || '',
    afterImageUrl: item.afterImageUrl || '',
    isPublished: Boolean(item.isPublished),
    isFeatured: Boolean(item.isFeatured),
    sortOrder: item.sortOrder ?? 0,
  };
}

export default function GalleryItemDrawer({ isOpen, mode = 'create', item, saving = false, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setForm(toForm(item));
  }, [item, isOpen]);

  const original = useMemo(() => JSON.stringify(toForm(item)), [item]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((state) => ({ ...state, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave?.(form);
  }

  const footer = (
    <>
      {mode === 'edit' && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="gallery-item-form" disabled={saving || !hasChanges || !form.title || !form.mainImageUrl}>
        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </>
  );

  return (
    <>
      <BaseDrawer
        isOpen={isOpen}
        title={mode === 'create' ? 'Nuevo trabajo de galería' : item?.title || 'Detalle del trabajo'}
        description="Gestioná trabajos visibles en la web pública: título, descripción, imágenes, publicación y destacado."
        onClose={onClose}
        size="lg"
        footer={footer}
      >
        <form id="gallery-item-form" className="gallery-form-grid" onSubmit={handleSubmit}>
          <section className="gallery-panel gallery-span-2">
            <h3>Datos principales</h3>
            <div className="gallery-form-inner">
              <label className="crm-field"><span>Título</span><input name="title" value={form.title} onChange={handleChange} required placeholder="Portón, estructura, escalera..." /></label>
              <label className="crm-field"><span>Categoría</span><input name="category" value={form.category} onChange={handleChange} placeholder="Portones, estructuras, pintura..." /></label>
              <label className="crm-field gallery-span-2"><span>Descripción</span><textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción del trabajo realizado" /></label>
              <label className="crm-field"><span>Orden</span><input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} /></label>
            </div>
          </section>

          <section className="gallery-panel gallery-span-2">
            <h3>Imágenes</h3>
            <div className="gallery-form-inner">
              <label className="crm-field gallery-span-2"><span>Imagen principal</span><input name="mainImageUrl" value={form.mainImageUrl} onChange={handleChange} required placeholder="/images/trabajo.jpg o URL externa" /></label>
              <label className="crm-field"><span>Imagen antes</span><input name="beforeImageUrl" value={form.beforeImageUrl} onChange={handleChange} placeholder="Opcional" /></label>
              <label className="crm-field"><span>Imagen después</span><input name="afterImageUrl" value={form.afterImageUrl} onChange={handleChange} placeholder="Opcional" /></label>
            </div>
            {form.mainImageUrl && (
              <div className="gallery-preview-box">
                <img src={resolveProjectImage(form.mainImageUrl)} alt="Vista previa" />
              </div>
            )}
          </section>

          <section className="gallery-panel gallery-span-2">
            <h3>Publicación</h3>
            <div className="gallery-switch-row">
              <label><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} /> <span>{form.isPublished ? <Eye size={16} /> : <EyeOff size={16} />} Visualizar en web</span></label>
              <label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> <span><Star size={16} /> Destacar</span></label>
            </div>
          </section>
        </form>
      </BaseDrawer>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Eliminar trabajo de galería"
        description={`¿Estás seguro de querer eliminar ${item?.title || 'este trabajo'}?`}
        confirmLabel="Sí, eliminar"
        danger
        loading={saving}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete?.(item)}
      />
    </>
  );
}
