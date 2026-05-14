import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT_DIR = process.cwd();
const DEFAULT_STORAGE = process.env.PDF_STORAGE_PATH || 'storage/pdfs';

export async function ensurePdfStorage() {
  const directory = path.resolve(ROOT_DIR, '../../', DEFAULT_STORAGE);
  await fs.mkdir(directory, { recursive: true });
  return directory;
}

export function createPdfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function buildPdfPublicUrl(token) {
  return `/api/public/quotes/${token}/download`;
}

export async function getPdfFileBuffer(filePath) {
  return fs.readFile(filePath);
}
