import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { cfBrandName, cfBrandSlogan } from '../../../../packages/branding/cfLogo.js';

const PAGE = { left: 50, right: 545, width: 495, bottom: 740 };
const COLORS = { ink: '#222220', muted: '#6f6a60', line: '#ded6c7', accent: '#c97835', soft: '#f4eadc' };

function ensureDir(dirPath) { if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true }); }
function money(value) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value || 0)); }
function date(value) { if (!value) return '-'; return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'America/Argentina/Cordoba' }).format(new Date(value)); }
function clean(value, fallback = '-') { const text = String(value || '').trim(); return text || fallback; }
function lines(value) { return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean); }
function storageFileFromUrl(url = '') { if (!url || url.startsWith('http') || url.startsWith('data:')) return ''; return path.resolve(process.cwd(), url.replace(/^\//, '')); }
function imageBuffer(url = '') { const filePath = storageFileFromUrl(url); if (!filePath || !fs.existsSync(filePath)) return null; return fs.readFileSync(filePath); }
function fitPage(doc, y, needed = 80) { if (y + needed <= PAGE.bottom) return y; doc.addPage(); return 70; }

function drawFooter(doc) {
  const oldY = doc.y;
  doc.save();
  doc.moveTo(PAGE.left, 772).lineTo(PAGE.right, 772).strokeColor('#eee7dc').lineWidth(0.7).stroke();
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#b9b1a5').text('CF Metal Pintura | Soluciones Integrales', PAGE.left, 782, { width: PAGE.width, align: 'center' });
  doc.restore();
  doc.y = oldY;
}

function drawFallbackLogo(doc, x, y) {
  doc.save();
  doc.roundedRect(x, y, 76, 54, 8).fill('#f7f3ea');
  doc.fillColor(COLORS.ink);
  doc.polygon([x + 9, y + 21], [x + 38, y + 6], [x + 69, y + 21], [x + 69, y + 28], [x + 38, y + 13], [x + 9, y + 28]).fill();
  doc.rect(x + 18, y + 31, 15, 16).fill();
  doc.rect(x + 42, y + 26, 16, 21).fill();
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#f7f3ea').text('CF', x + 45, y + 35, { width: 25, align: 'center' });
  doc.restore();
}

function drawLogo(doc, settings, x, y) {
  const buffer = imageBuffer(settings?.logoUrl);
  if (buffer) {
    try { doc.image(buffer, x, y, { fit: [84, 58] }); return; } catch { /* fallback */ }
  }
  drawFallbackLogo(doc, x, y);
}

function getRecipient(quote) {
  return {
    name: quote.recipientName || quote.client?.fullName || quote.recipientCompany || 'Cliente no informado',
    company: quote.recipientCompany,
    contact: quote.recipientContactName,
    phone: quote.recipientPhone || quote.client?.phone,
    email: quote.recipientEmail || quote.client?.email,
    address: quote.recipientAdminAddress || quote.recipientAddress || quote.client?.address,
    city: quote.recipientCity || quote.client?.city,
    province: quote.recipientProvince,
  };
}

function drawHeader(doc, quote, settings) {
  doc.rect(0, 0, 595.28, 106).fill(COLORS.ink);
  drawLogo(doc, settings, PAGE.left, 24);
  const brand = settings?.publicName || settings?.businessName || cfBrandName;
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#ffffff').text(brand, 150, 30, { width: 260 });
  doc.font('Helvetica').fontSize(9).fillColor('#d9d2c6').text(cfBrandSlogan, 150, 57, { width: 260 });
  doc.font('Helvetica-Bold').fontSize(22).fillColor('#ffffff').text('Cotización', 365, 30, { width: 180, align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor('#d9d2c6').text(`N.º ${clean(quote.quoteNumber, '')}`, 365, 60, { width: 180, align: 'right' });
  return 132;
}

function labelValue(doc, label, value, x, y, width = 220) {
  if (!value) return y;
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.accent).text(label.toUpperCase(), x, y, { width });
  doc.font('Helvetica').fontSize(9.2).fillColor(COLORS.ink).text(clean(value), x, y + 11, { width, lineGap: 2 });
  return doc.y + 8;
}

function drawIntro(doc, quote, settings, y) {
  const r = getRecipient(quote);
  const leftX = PAGE.left;
  const rightX = 330;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.accent).text('DESTINATARIO', leftX, y);
  y += 18;
  let ly = y;
  ly = labelValue(doc, 'Cliente', [r.name, r.company && r.company !== r.name ? r.company : ''].filter(Boolean).join(' · '), leftX, ly, 245);
  ly = labelValue(doc, 'Contacto', r.contact, leftX, ly, 245);
  ly = labelValue(doc, 'Teléfono', r.phone, leftX, ly, 245);
  ly = labelValue(doc, 'Email', r.email, leftX, ly, 245);
  ly = labelValue(doc, 'Dirección', [r.address, r.city, r.province].filter(Boolean).join(' · '), leftX, ly, 245);

  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.accent).text('DATOS DEL PRESUPUESTO', rightX, y - 18);
  let ry = y;
  ry = labelValue(doc, 'Emisión', date(quote.createdAt), rightX, ry, 215);
  ry = labelValue(doc, 'Vencimiento', date(quote.validUntil), rightX, ry, 215);
  ry = labelValue(doc, 'Emisor', settings?.publicName || settings?.businessName || 'CF Metal-Pintura', rightX, ry, 215);
  ry = labelValue(doc, 'Contacto', [settings?.phone, settings?.email].filter(Boolean).join(' · '), rightX, ry, 215);
  const nextY = Math.max(ly, ry) + 8;
  doc.moveTo(PAGE.left, nextY).lineTo(PAGE.right, nextY).strokeColor(COLORS.line).lineWidth(.7).stroke();
  return nextY + 22;
}

function section(doc, title, y) {
  y = fitPage(doc, y, 40);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text(title, PAGE.left, y);
  doc.moveTo(PAGE.left, y + 18).lineTo(PAGE.right, y + 18).strokeColor(COLORS.line).lineWidth(.7).stroke();
  return y + 30;
}

function paragraph(doc, value, y) {
  if (!value) return y;
  y = fitPage(doc, y, 60);
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.muted).text(String(value), PAGE.left, y, { width: PAGE.width, lineGap: 3 });
  return doc.y + 12;
}

function bulletList(doc, title, value, y) {
  const rows = lines(value);
  if (!rows.length) return y;
  y = section(doc, title, y);
  rows.forEach((row) => {
    y = fitPage(doc, y, 24);
    doc.font('Helvetica').fontSize(9.3).fillColor(COLORS.muted).text(`- ${row.replace(/^[-•]\s*/, '')}`, PAGE.left + 8, y, { width: PAGE.width - 16, lineGap: 2 });
    y = doc.y + 5;
  });
  return y + 4;
}

function drawItems(doc, quote, y) {
  y = section(doc, 'Detalle económico', y);
  const rows = [];
  (quote.items || []).forEach((item) => {
    const quantity = Number(item.quantity || 1);
    const total = Number(item.total || quantity * Number(item.unitPrice || 0));
    rows.push({ name: item.name, detail: [item.description, item.note].filter(Boolean).join(' · '), total });
  });
  if (Number(quote.materialsCost || 0)) rows.push({ name: 'Materiales', detail: 'Materiales estimados para el trabajo.', total: Number(quote.materialsCost) });
  if (Number(quote.laborCost || 0)) rows.push({ name: 'Mano de obra', detail: 'Mano de obra presupuestada.', total: Number(quote.laborCost) });
  if (Number(quote.paintCost || 0)) rows.push({ name: 'Pintura', detail: 'Pintura y terminación.', total: Number(quote.paintCost) });
  if (Number(quote.extraCost || 0)) rows.push({ name: 'Extras / traslado', detail: 'Extras, traslado o viáticos.', total: Number(quote.extraCost) });

  doc.roundedRect(PAGE.left, y, PAGE.width, 26, 6).fill(COLORS.soft);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.ink).text('Concepto', PAGE.left + 10, y + 9, { width: 140 });
  doc.text('Detalle', PAGE.left + 160, y + 9, { width: 235 });
  doc.text('Importe', PAGE.left + 405, y + 9, { width: 78, align: 'right' });
  y += 38;

  rows.forEach((row) => {
    y = fitPage(doc, y, 42);
    doc.moveTo(PAGE.left, y - 6).lineTo(PAGE.right, y - 6).strokeColor(COLORS.line).lineWidth(.5).stroke();
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(clean(row.name, 'Concepto'), PAGE.left + 10, y, { width: 140 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text(clean(row.detail, 'Detalle incluido'), PAGE.left + 160, y, { width: 235, lineGap: 2 });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(money(row.total), PAGE.left + 405, y, { width: 78, align: 'right' });
    y = Math.max(doc.y + 10, y + 34);
  });

  y = fitPage(doc, y, 92);
  const x = 335;
  doc.roundedRect(x, y, 210, 82, 8).fill(COLORS.soft);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text('Subtotal', x + 14, y + 14, { width: 90 });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(money(quote.subtotal), x + 110, y + 14, { width: 82, align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text(`Margen (${Number(quote.profitMargin || 0)}%)`, x + 14, y + 34, { width: 90 });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(money(Number(quote.subtotal || 0) * (Number(quote.profitMargin || 0) / 100)), x + 110, y + 34, { width: 82, align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text('Descuento', x + 14, y + 54, { width: 90 });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(money(quote.discount), x + 110, y + 54, { width: 82, align: 'right' });
  y += 94;
  doc.rect(x, y, 210, 42).fill(COLORS.ink);
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff').text('TOTAL', x + 14, y + 15, { width: 70 });
  doc.font('Helvetica-Bold').fontSize(15).fillColor('#ffffff').text(money(quote.total), x + 92, y + 13, { width: 100, align: 'right' });
  return y + 58;
}

function drawSignatureImage(doc, settings, x, y) {
  if (!settings?.signatureUrl) return y;
  const buffer = imageBuffer(settings.signatureUrl);
  if (!buffer) return y;
  try { doc.image(buffer, x, y, { fit: [150, 55] }); return y + 58; } catch { return y; }
}

function closing(doc, quote, settings, y) {
  y = fitPage(doc, y, 118);
  const x = PAGE.left;
  if (quote.includeDigitalSignature) y = drawSignatureImage(doc, settings, x, y);
  doc.font('Helvetica').fontSize(12).fillColor(COLORS.ink).text('.....................', x, y, { width: 180 });
  y += 24;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.ink).text('Atentamente,', x, y);
  y += 22;
  doc.font('Helvetica').fontSize(10).fillColor(COLORS.ink).text('CF Metal-Pintura', x, y);
  y += 14;
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text('Soluciones Integrales', x, y);
  return y + 20;
}

function hasConditions(quote) { return Boolean(quote.excludedTasks || quote.technicalNotes || quote.paymentTerms || quote.executionTime || quote.warranty || quote.commercialConditions || quote.internalNotes); }

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
      doc.on('pageAdded', () => drawFooter(doc));

      let y = drawHeader(doc, quote, settings);
      y = drawIntro(doc, quote, settings, y);
      y = section(doc, 'Trabajo solicitado', y);
      y = paragraph(doc, quote.workObject ? `Tipo de trabajo: ${quote.workObject}` : quote.title, y);
      if (quote.workLocation) y = paragraph(doc, `Ubicación: ${quote.workLocation}`, y);
      y = paragraph(doc, quote.description, y);
      y = bulletList(doc, 'Alcance incluido', quote.includedTasks, y);
      y = drawItems(doc, quote, y);

      if (!hasConditions(quote)) {
        closing(doc, quote, settings, y + 14);
      } else {
        doc.addPage();
        let cy = 70;
        doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.ink).text('Condiciones del presupuesto', PAGE.left, cy);
        doc.font('Helvetica').fontSize(9).fillColor(COLORS.muted).text(`Presupuesto ${quote.quoteNumber} · Emisión ${date(quote.createdAt)} · Vencimiento ${date(quote.validUntil)}`, PAGE.left, cy + 26);
        cy += 58;
        cy = bulletList(doc, 'Exclusiones / no incluye', quote.excludedTasks, cy);
        cy = bulletList(doc, 'Notas técnicas', quote.technicalNotes, cy);
        cy = bulletList(doc, 'Forma de pago', quote.paymentTerms, cy);
        cy = bulletList(doc, 'Plazo estimado', quote.executionTime, cy);
        cy = bulletList(doc, 'Garantía', quote.warranty, cy);
        cy = bulletList(doc, 'Condiciones adicionales', quote.commercialConditions, cy);
        cy = paragraph(doc, quote.internalNotes ? `Observaciones internas: ${quote.internalNotes}` : '', cy);
        closing(doc, quote, settings, cy + 12);
      }

      drawFooter(doc);
      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    const updated = await prisma.quote.update({ where: { id: quoteId }, data: { pdfUrl: publicUrl }, include: { client: true, job: true, items: true, pdfDocuments: true } });
    return { quote: updated, filePath, fileName, publicUrl };
  },
};