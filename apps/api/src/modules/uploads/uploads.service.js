import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { badRequest } from '../../utils/ApiError.js';

const allowedMimeTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const uploadsDir = path.resolve(process.cwd(), 'storage/uploads');

function parseBase64Image(file) {
  if (!file?.dataUrl) throw badRequest('No se recibió ninguna imagen');

  const match = String(file.dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw badRequest('Formato de imagen inválido');

  const mimeType = match[1];
  const base64 = match[2];
  const extension = allowedMimeTypes.get(mimeType);
  if (!extension) throw badRequest('Solo se permiten imágenes JPG, PNG, WEBP o GIF');

  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length) throw badRequest('La imagen está vacía');
  if (buffer.length > MAX_SIZE_BYTES) throw badRequest('La imagen no puede superar los 8MB');

  return { buffer, mimeType, extension };
}

function safeName(value = 'imagen') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'imagen';
}

export const uploadsService = {
  async uploadImage(file = {}) {
    const { buffer, mimeType, extension } = parseBase64Image(file);
    await fs.mkdir(uploadsDir, { recursive: true });

    const baseName = safeName(file.fileName || file.name || 'imagen');
    const fileName = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}-${baseName}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    return {
      fileName,
      mimeType,
      sizeBytes: buffer.length,
      url: `/storage/uploads/${fileName}`,
    };
  },
};
