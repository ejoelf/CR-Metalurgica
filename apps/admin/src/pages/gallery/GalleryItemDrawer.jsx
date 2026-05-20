import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, ImagePlus, Loader2, Save, Star, Trash2, UploadCloud } from 'lucide-react';
import BaseDrawer from '../../components/common/BaseDrawer.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { resolveProjectImage } from '../../data/projectImages.js';
import { uploadsService } from '../../services/uploadsService.js';

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

function ImageUploadField({ label, value, required = false, uploading = false, onSelectFile, onChangeUrl }) {
  const inputRef = useRef(null);

  return (
    <div className="gallery-upload-field">
      <div className="gallery-upload-header">
        <span>{label}{required ? ' *' : ''}</span>
        <button className="crm-button" type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={16} className="spin-icon" /> : <UploadCloud size={16} />} Cargar archivo
        </button>
      </div>
      <input ref={inputRef} className="hidden-file-input" type="file" accept="image/*" onChange={onSelectFile} />
      <input value={value || ''} onChange={(event) => onChangeUrl(event.target.value)} required={required} placeholder="URL o imagen cargada" />
      {value ? (
        <div className="gallery-preview-box compact">
          <img src={resolveProjectImage(value)} alt={`Vista previa ${label}`} />
        </div>
      ) : (
        <div className="gallery-preview-empty"><ImagePlus size={20} /> Sin imagen cargada</div>
      )}
    </div>
  );
}

export default function GalleryItemDrawer({ isOpen, mode = 'create', item, saving = false, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    setForm(toForm(item));
    setUploadError('');
    setUploadingField('');
  }, [item, isOpen]);

  const original = useMemo(() => JSON.stringify(toForm(item)), [item]);
  const current = useMemo(() => JSON.stringify(form), [form]);
  const hasChanges = mode === 'create' ? true : original !== current;

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((state) => ({ ...state, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleUrlChange(field, value) {
    setForm((state) => ({ ...state, [field]: value }));
  }

  async function handleUpload(field, event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setUploadError('');
      setUploadingField(field);
      const uploaded = await uploadsService.uploadImage(file);
      setForm((state) => ({ ...state, [field]: uploaded.url }));
    } catch (error) {
      setUploadError(error.message || 'No se pudo cargar la imagen');
    } finally {
      setUploadingField('');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave?.(form);
  }

  const footer = (
    <>
      {mode === 'edit' && <button className="crm-button danger" type="button" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Eliminar</button>}
      <button className="crm-button ghost" type="button" onClick={onClose}>Cancelar</button>
      <button className="crm-button primary" type="submit" form="gallery-item-form" disabled={saving || Boolean(uploadingField) || !hasChanges || !form.title || !form.mainImageUrl}>
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
            {uploadError && <p className="error-box">{uploadError}</p>}
            <div className="gallery-upload-grid">
              <ImageUploadField
                label="Imagen principal"
                value={form.mainImageUrl}
                required
                uploading={uploadingField === 'mainImageUrl'}
                onSelectFile={(event) => handleUpload('mainImageUrl', event)}
                onChangeUrl={(value) => handleUrlChange('mainImageUrl', value)}
              />
              <ImageUploadField
                label="Imagen antes"
                value={form.beforeImageUrl}
                uploading={uploadingField === 'beforeImageUrl'}
                onSelectFile={(event) => handleUpload('beforeImageUrl', event)}
                onChangeUrl={(value) => handleUrlChange('beforeImageUrl', value)}
              />
              <ImageUploadField
                label="Imagen después"
                value={form.afterImageUrl}
                uploading={uploadingField === 'afterImageUrl'}
                onSelectFile={(event) => handleUpload('afterImageUrl', event)}
                onChangeUrl={(value) => handleUrlChange('afterImageUrl', value)}
              />
            </div>
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
