import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { cfBrandName, cfBrandSlogan } from '../../../../packages/branding/cfLogo.js';

const PAGE = { left: 50, right: 545, width: 495, bottom: 744 };
const COLORS = { ink: '#1f1f1c', muted: '#625d55', line: '#ded8cc', accent: '#c97835', soft: '#f7efe4' };

function ensureDir(dirPath) { if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true }); }
function money(value) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value || 0)); }
function date(value) { if (!value) return '-'; return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'America/Argentina/Cordoba' }).format(new Date(value)); }
function clean(value, fallback = '-') { const text = String(value || '').trim(); return text || fallback; }
function lines(value) { return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean); }
function storageFileFromUrl(url = '') { if (!url || url.startsWith('http') || url.startsWith('data:')) return ''; return path.resolve(process.cwd(), url.replace(/^\//, '')); }
function imageBuffer(url = '') { const filePath = storageFileFromUrl(url); if (!filePath || !fs.existsSync(filePath)) return null; return fs.readFileSync(filePath); }
function fitPage(doc, y, needed = 80) { if (y + needed <= PAGE.bottom) return y; doc.addPage(); return 62; }

function drawPageFooter(doc) {
  const oldY = doc.y;
  doc.save();
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#b9b1a5').text('CF Metal Pintura | Soluciones Integrales', PAGE.left, 782, { width: PAGE.width, align: 'center' });
  doc.moveTo(PAGE.left, 772).lineTo(PAGE.right, 772).strokeColor('#eee7dc').lineWidth(0.7).stroke();
  doc.restore();
  doc.y = oldY;
}

function drawFallbackLogo(doc, x, y) {
  doc.save();
  doc.roundedRect(x, y, 86, 64, 10).fill('#f7f3ea');
  doc.fillColor(COLORS.ink);
  doc.polygon([x + 10, y + 24], [x + 43, y + 7], [x + 78, y + 24], [x + 78, y + 32], [x + 43, y + 15], [x + 10, y + 32]).fill();
  doc.rect(x + 20, y + 34, 17, 18).fill();
  doc.rect(x + 47, y + 28, 17, 24).fill();
  doc.font('Helvetica-Bold').fontSize(16).fillColor('#f7f3ea').text('CF', x + 52, y + 39, { width: 28, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.ink).text('METAL-PINTURA', x + 8, y + 54, { width: 70, align: 'center' });
  doc.restore();
}

function drawLogo(doc, settings, x, y) {
  const buffer = imageBuffer(settings?.logoUrl);
  if (buffer) {
    try { doc.image(buffer, x, y, { fit: [92, 66] }); return; } catch { /* fallback */ }
  }
  drawFallbackLogo(doc, x, y);
}

function heading(doc, title, y) {
  y = fitPage(doc, y, 42);
  doc.roundedRect(PAGE.left, y - 4, PAGE.width, 28, 8).fill(COLORS.soft);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text(title, PAGE.left + 12, y + 4, { width: PAGE.width - 24 });
  return y + 38;
}

function paragraph(doc, value, y, options = {}) {
  if (!value) return y;
  y = fitPage(doc, y, 70);
  doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(options.size || 9.5).fillColor(options.color || COLORS.muted).text(String(value), options.x || PAGE.left, y, { width: options.width || PAGE.width, lineGap: 3 });
  return doc.y + 10;
}

function bulletList(doc, value, y) {
  for (const line of lines(value)) {
    y = fitPage(doc, y, 28);
    doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.muted).text(`- ${line.replace(/^[-•]\s*/, '')}`, PAGE.left + 10, y, { width: PAGE.width - 20, lineGap: 3 });
    y = doc.y + 5;
  }
  return y + 2;
}

function getRecipient(quote) {
  return {
    name: quote.recipientName || quote.client?.fullName || quote.recipientCompany || 'Cliente no informado',
    company: quote.recipientCompany,
    contact: quote.recipientContactName,
    phone: quote.recipientPhone || quote.client?.phone,
    email: quote.recipientEmail || quote.client?.email,
    taxId: quote.recipientTaxId || quote.client?.taxId,
    address: quote.recipientAdminAddress || quote.recipientAddress || quote.client?.address,
    city: quote.recipientCity || quote.client?.city,
    province: quote.recipientProvince,
  };
}

function drawHeader(doc, quote, settings) {
  doc.rect(0, 0, 595.28, 116).fill(COLORS.ink);
  drawLogo(doc, settings, PAGE.left, 22);
  const brand = settings?.publicName || settings?.businessName || cfBrandName;
  doc.font('Helvetica-Bold').fontSize(18).fillColor('#ffffff').text(brand, 155, 30, { width: 240 });
  doc.font('Helvetica').fontSize(9.5).fillColor('#d9d2c6').text(cfBrandSlogan, 155, 56, { width: 240 });
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#ffffff').text(`Presupuesto N.º ${clean(quote.quoteNumber, '')}`, 360, 30, { width: 185, align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor('#d9d2c6').text(`Fecha: ${date(quote.createdAt)}`, 360, 54, { width: 185, align: 'right' });
  doc.text(`Validez: ${date(quote.validUntil)}`, 360, 70, { width: 185, align: 'right' });
  return 140;
}

function drawPlainSection(doc, title, fields, y) {
  const visible = fields.filter((item) => item.value);
  if (!visible.length) return y;
  y = fitPage(doc, y, 28 + visible.length * 18);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.accent).text(title, PAGE.left, y, { width: PAGE.width });
  y += 18;
  visible.forEach((item) => {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.accent).text(`${item.label}:`, PAGE.left, y, { width: 118, continued: true });
    doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink).text(` ${clean(item.value)}`, { width: PAGE.width - 118 });
    y = doc.y + 5;
  });
  doc.moveTo(PAGE.left, y + 3).lineTo(PAGE.right, y + 3).strokeColor(COLORS.line).lineWidth(.6).stroke();
  return y + 16;
}

function drawInfoBlock(doc, quote, settings, y) {
  const r = getRecipient(quote);
  y = drawPlainSection(doc, 'DATOS DEL CLIENTE', [
    { label: 'Nombre', value: r.name },
    { label: 'Empresa', value: r.company },
    { label: 'Contacto', value: r.contact },
    { label: 'Teléfono', value: r.phone },
    { label: 'Email', value: r.email },
    { label: 'CUIT / DNI', value: r.taxId },
    { label: 'Dirección', value: [r.address, r.city, r.province].filter(Boolean).join(' · ') },
  ], y);
  y = drawPlainSection(doc, 'DATOS DEL EMISOR', [
    { label: 'Empresa', value: settings?.publicName || settings?.businessName || 'CF Metal-Pintura' },
    { label: 'Identidad', value: cfBrandSlogan },
    { label: 'Dirección', value: settings?.address || 'Pasaje Mirage 41, Las Higueras, Córdoba' },
    { label: 'Teléfono', value: settings?.phone || '(358) 155719450' },
    { label: 'Email', value: settings?.email },
  ], y);
  return y;
}

function drawCostTable(doc, quote, y) {
  y = heading(doc, 'Detalle de costos', y);
  doc.roundedRect(PAGE.left, y, PAGE.width, 26, 6).fill(COLORS.soft);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.ink);
  doc.text('Concepto', PAGE.left + 10, y + 9, { width: 130 });
  doc.text('Descripción', PAGE.left + 150, y + 9, { width: 210 });
  doc.text('Cant.', PAGE.left + 366, y + 9, { width: 46, align: 'right' });
  doc.text('Monto', PAGE.left + 420, y + 9, { width: 65, align: 'right' });
  y += 36;
  for (const item of quote.items || []) {
    y = fitPage(doc, y, 50);
    const q = Number(item.quantity || 1);
    const total = Number(item.total || q * Number(item.unitPrice || 0));
    const desc = [item.description, item.note].filter(Boolean).join(' · ');
    const h = Math.max(36, doc.heightOfString(desc || '-', { width: 210 }) + 16);
    doc.moveTo(PAGE.left, y - 5).lineTo(PAGE.right, y - 5).strokeColor(COLORS.line).lineWidth(.5).stroke();
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(clean(item.name, 'Ítem'), PAGE.left + 10, y, { width: 130 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text(clean(desc), PAGE.left + 150, y, { width: 210, lineGap: 2 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.ink).text(`${q} ${clean(item.unit, '')}`, PAGE.left + 366, y, { width: 46, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(money(total), PAGE.left + 420, y, { width: 65, align: 'right' });
    y += h;
  }
  return y + 8;
}

function drawTotals(doc, quote, y) {
  y = fitPage(doc, y, 150);
  const x = 320, w = 225;
  const rows = [];
  if (Number(quote.paintCost || 0)) rows.push(['Pintura', money(quote.paintCost)]);
  if (Number(quote.laborCost || 0)) rows.push(['Mano de obra', money(quote.laborCost)]);
  if (Number(quote.materialsCost || 0)) rows.push(['Materiales', money(quote.materialsCost)]);
  if (Number(quote.extraCost || 0)) rows.push(['Extra / traslado', money(quote.extraCost)]);
  rows.push(['Subtotal', money(quote.subtotal)]);
  rows.push([`Margen (${Number(quote.profitMargin || 0)}%)`, money(Number(quote.subtotal || 0) * (Number(quote.profitMargin || 0) / 100))]);
  rows.push(['Descuento', money(quote.discount)]);
  doc.roundedRect(x, y, w, rows.length * 21 + 54, 10).fill(COLORS.soft);
  let cursor = y + 13;
  rows.forEach(([label, value]) => {
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text(label, x + 14, cursor, { width: 100 });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(value, x + 112, cursor, { width: 95, align: 'right' });
    cursor += 21;
  });
  doc.rect(x, cursor + 6, w, 38).fill(COLORS.ink);
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#fff').text('TOTAL GENERAL\nESTIMADO', x + 14, cursor + 13, { width: 105, lineGap: -1 });
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#fff').text(money(quote.total), x + 112, cursor + 17, { width: 95, align: 'right' });
  return cursor + 58;
}

function drawSignatureImage(doc, settings, x, y) {
  if (!settings?.signatureUrl) return y;
  const buffer = imageBuffer(settings.signatureUrl);
  if (!buffer) return y;
  try { doc.image(buffer, x, y, { fit: [150, 55] }); return y + 58; } catch { return y; }
}

function drawClosing(doc, quote, settings, y) {
  y = fitPage(doc, y, 130);
  const x = PAGE.left + 20;
  if (quote.includeDigitalSignature) y = drawSignatureImage(doc, settings, x, y);
  doc.font('Helvetica').fontSize(12).fillColor(COLORS.ink).text('.....................', x, y, { width: 180 });
  y += 26;
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text('Atentamente,', x, y, { width: 220 });
  y += 28;
  doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.ink).text('CF Metal-Pintura', x, y, { width: 220 });
  y += 16;
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text('Soluciones Integrales', x, y, { width: 220 });
  return y + 18;
}

export const quotePdfService = {
  async generate(quoteId) {
    const [quote, settings] = await Promise.all([
      prisma.quote.findUnique({ where: { id: quoteId }, include: { client: true, job: true, items: { orderBy: { sortOrder: 'asc' } } } }),
      prisma.businessSettings.findFirst(),
    ]);
    if (!quote) throw new Error('Presupuesto no encontrado');
    const storagePath = path.resolve(process.cwd(), env.pdfStoragePath);
    ensureDir(storagePath);
    const safeNumber = String(quote.quoteNumber || quote.id).replace(/[^a-zA-Z0-9-_]/g, '-');
    const fileName = `${safeNumber}.pdf`;
    const filePath = path.join(storagePath, fileName);
    const publicUrl = `/storage/pdfs/${fileName}`;
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50, autoFirstPage: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      doc.on('pageAdded', () => drawPageFooter(doc));
      let y = drawHeader(doc, quote, settings);
      y = drawInfoBlock(doc, quote, settings, y);
      y = heading(doc, 'Detalle del trabajo solicitado', y);
      y = paragraph(doc, quote.workObject ? `Objeto: ${quote.workObject}` : quote.title, y, { bold: Boolean(quote.workObject), color: COLORS.ink });
      if (quote.workLocation) y = paragraph(doc, `Ubicación de obra: ${quote.workLocation}`, y, { color: COLORS.ink });
      y = paragraph(doc, quote.description, y);
      if (quote.includedTasks) { y = heading(doc, 'Alcance / tareas incluidas', y); y = bulletList(doc, quote.includedTasks, y); }
      y = drawCostTable(doc, quote, y);
      y = drawTotals(doc, quote, y);
      const conditions = [quote.excludedTasks, quote.technicalNotes, quote.paymentTerms ? `Forma de pago: ${quote.paymentTerms}` : '', quote.executionTime ? `Plazo estimado: ${quote.executionTime}` : '', quote.warranty ? `Garantía: ${quote.warranty}` : '', quote.commercialConditions].filter(Boolean).join('\n');
      if (conditions) { y = heading(doc, 'Condiciones', y + 12); y = bulletList(doc, conditions, y); }
      if (quote.internalNotes) { y = heading(doc, 'Observaciones internas / comerciales', y + 6); y = paragraph(doc, quote.internalNotes, y); }
      drawClosing(doc, quote, settings, y + 12);
      drawPageFooter(doc);
      doc.end();
      stream.on('finish', resolve); stream.on('error', reject);
    });
    const updated = await prisma.quote.update({ where: { id: quoteId }, data: { pdfUrl: publicUrl }, include: { client: true, job: true, items: true, pdfDocuments: true } });
    return { quote: updated, filePath, fileName, publicUrl };
  },
};
