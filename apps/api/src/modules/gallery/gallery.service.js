import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function buildUniqueSlug(title, currentId = null) {
  const base = slugify(title) || `trabajo-${Date.now()}`;
  let slug = base;
  let counter = 2;

  while (true) {
    const existing = await prisma.galleryItem.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

function normalizePayload(data = {}) {
  if (!data.title) throw badRequest('El título es requerido');
  if (!data.mainImageUrl) throw badRequest('La imagen principal es requerida');

  return {
    title: String(data.title).trim(),
    description: data.description ? String(data.description).trim() : null,
    category: data.category ? String(data.category).trim() : null,
    mainImageUrl: String(data.mainImageUrl).trim(),
    beforeImageUrl: data.beforeImageUrl ? String(data.beforeImageUrl).trim() : null,
    afterImageUrl: data.afterImageUrl ? String(data.afterImageUrl).trim() : null,
    isFeatured: Boolean(data.isFeatured),
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    sortOrder: Number(data.sortOrder || 0),
  };
}

export const galleryService = {
  async findMany({ search, category, isPublished, isFeatured } = {}) {
    const searchValue = String(search || '').trim();

    return prisma.galleryItem.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(isPublished !== undefined && isPublished !== '' ? { isPublished: isPublished === true || isPublished === 'true' } : {}),
        ...(isFeatured !== undefined && isFeatured !== '' ? { isFeatured: isFeatured === true || isFeatured === 'true' } : {}),
        ...(searchValue
          ? {
              OR: [
                { title: { contains: searchValue, mode: 'insensitive' } },
                { description: { contains: searchValue, mode: 'insensitive' } },
                { category: { contains: searchValue, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  },

  async publicList(query = {}) {
    return this.findMany({ ...query, isPublished: true });
  },

  async findById(id) {
    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (!item) throw notFound('Trabajo de galería no encontrado');
    return item;
  },

  async create(data) {
    const payload = normalizePayload(data);
    const slug = await buildUniqueSlug(payload.title);
    return prisma.galleryItem.create({ data: { ...payload, slug } });
  },

  async update(id, data) {
    await this.findById(id);
    const payload = normalizePayload(data);
    const slug = await buildUniqueSlug(payload.title, id);
    return prisma.galleryItem.update({ where: { id }, data: { ...payload, slug } });
  },

  async togglePublished(id) {
    const item = await this.findById(id);
    return prisma.galleryItem.update({ where: { id }, data: { isPublished: !item.isPublished } });
  },

  async toggleFeatured(id) {
    const item = await this.findById(id);
    return prisma.galleryItem.update({ where: { id }, data: { isFeatured: !item.isFeatured } });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.galleryItem.delete({ where: { id } });
  },
};
