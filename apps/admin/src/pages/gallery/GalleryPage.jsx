import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, GalleryHorizontal, Plus, Search, Star } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import GalleryItemDrawer from './GalleryItemDrawer.jsx';
import { galleryService } from '../../services/galleryService.js';
import { resolveProjectImage } from '../../data/projectImages.js';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  async function loadItems() {
    try {
      setLoading(true);
      setError('');
      const data = await galleryService.list({
        search,
        category: categoryFilter,
        isPublished: visibilityFilter,
      });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la galería');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadItems, 250);
    return () => window.clearTimeout(timer);
  }, [search, categoryFilter, visibilityFilter]);

  const categories = useMemo(() => {
    return [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  }, [items]);

  function openCreate() {
    setSelectedItem(null);
    setDrawerMode('create');
  }

  async function openItem(item) {
    try {
      setLoading(true);
      const detail = await galleryService.getById(item.id);
      setSelectedItem(detail);
      setDrawerMode('edit');
    } catch (err) {
      setError(err.message || 'No se pudo abrir el trabajo');
    } finally {
      setLoading(false);
    }
  }

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedItem(null);
  }

  async function handleSave(payload) {
    try {
      setSaving(true);
      if (drawerMode === 'create') {
        const created = await galleryService.create(payload);
        setSelectedItem(created);
        setDrawerMode('edit');
      } else if (selectedItem?.id) {
        const updated = await galleryService.update(selectedItem.id, payload);
        setSelectedItem(updated);
      }
      await loadItems();
    } catch (err) {
      setError(err.message || 'No se pudo guardar el trabajo');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!item?.id) return;
    try {
      setSaving(true);
      await galleryService.remove(item.id);
      closeDrawer();
      await loadItems();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el trabajo');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item) {
    try {
      setSaving(true);
      const updated = await galleryService.togglePublished(item.id);
      setItems((state) => state.map((entry) => entry.id === updated.id ? updated : entry));
    } catch (err) {
      setError(err.message || 'No se pudo cambiar la visualización');
    } finally {
      setSaving(false);
    }
  }

  async function toggleFeatured(item) {
    try {
      setSaving(true);
      const updated = await galleryService.toggleFeatured(item.id);
      setItems((state) => state.map((entry) => entry.id === updated.id ? updated : entry));
    } catch (err) {
      setError(err.message || 'No se pudo cambiar el destacado');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Contenido público"
        title="Galería administrable"
        description="Cargá trabajos, imágenes, categorías y decidí qué se visualiza en la web pública."
        action={<button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Nuevo trabajo</button>}
      />

      <section className="toolbar-card gallery-toolbar-v2">
        <div className="search-input">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar trabajo" />
        </div>
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
          <option value="">Todos</option>
          <option value="true">Visibles en web</option>
          <option value="false">Ocultos</option>
        </select>
      </section>

      {error && <p className="warning-box">{error}</p>}
      {loading && <LoadingState label="Cargando galería..." />}

      {!loading && !items.length && (
        <EmptyState
          icon={GalleryHorizontal}
          title="Todavía no hay trabajos cargados"
          description="Creá el primer trabajo para mostrarlo en la web pública."
          action={<button className="crm-button primary" type="button" onClick={openCreate}><Plus size={16} /> Nuevo trabajo</button>}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="gallery-admin-grid-v2">
          {items.map((item) => (
            <article className="gallery-admin-card-v2" key={item.id}>
              <button className="gallery-image-button" type="button" onClick={() => openItem(item)}>
                <img src={resolveProjectImage(item.mainImageUrl)} alt={item.title} />
                <span>{item.category || 'Sin categoría'}</span>
              </button>
              <div className="gallery-card-body-v2">
                <h3>{item.title}</h3>
                <p>{item.description || 'Sin descripción cargada.'}</p>
                <div className="gallery-card-status-row">
                  <span className={item.isPublished ? 'is-visible' : 'is-hidden'}>{item.isPublished ? 'Visible en web' : 'Oculto'}</span>
                  {item.isFeatured && <span className="is-featured">Destacado</span>}
                </div>
                <div className="gallery-card-actions">
                  <button className="crm-button" type="button" onClick={() => togglePublished(item)} disabled={saving}>{item.isPublished ? <EyeOff size={16} /> : <Eye size={16} />} {item.isPublished ? 'Ocultar' : 'Visualizar'}</button>
                  <button className="crm-button" type="button" onClick={() => toggleFeatured(item)} disabled={saving}><Star size={16} /> {item.isFeatured ? 'Quitar' : 'Destacar'}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <GalleryItemDrawer
        isOpen={Boolean(drawerMode)}
        mode={drawerMode || 'create'}
        item={selectedItem}
        saving={saving}
        onClose={closeDrawer}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
