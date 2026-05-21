import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { cfBrandName, cfBrandSlogan } from '../../../../packages/branding/cfLogo.js';

const PAGE = { left: 50, right: 545, width: 495, bottom: 760 };
const COLORS = {
  ink: '#1f1f1c',
  muted: '#6b665d',
  line: '#ded8cc',
  accent: '#b56f36',
  soft: '#f6f1e8',
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'America/Argentina/Cordoba' }).format(new Date(value));
}

function text(value, fallback = '-') {
  const clean = String(value || '').trim();
  return clean || fallback;
}

function splitLines(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function ensureSpace(doc, y, needed = 90) {
  if (y + needed <= PAGE.bottom) return y;
  doc.addPage();
  return 56;
}

function sectionTitle(doc, title, y) {
  y = ensureSpace(doc, y, 42);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text(title, PAGE.left, y);
  doc.moveTo(PAGE.left, y + 19).lineTo(PAGE.right, y + 19).strokeColor(COLORS.line).lineWidth(1).stroke();
  return y + 32;
}

function paragraph(doc, value, y, options = {}) {
  if (!value) return y;
  y = ensureSpace(doc, y, 70);
  const width = options.width || PAGE.width;
  doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(options.size || 9.5).fillColor(options.color || COLORS.muted);
  doc.text(String(value), options.x || PAGE.left, y, { width, lineGap: 3 });
  return doc.y + 10;
}

function bulletList(doc, value, y) {
  const lines = splitLines(value);
  if (!lines.length) return y;
  for (const line of lines) {
    y = ensureSpace(doc, y, 28);
    doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.muted).text(`• ${line.replace(/^[-•]\s*/, '')}`, PAGE.left + 8, y, { width: PAGE.width - 16, lineGap: 3 });
    y = doc.y + 5;
  }
  return y + 4;
}

function drawInfoLine(doc, label, value, x, y, width = 230) {
  if (!value) return y;
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.accent).text(label.toUpperCase(), x, y, { width });
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.ink).text(value, x, y + 12, { width, lineGap: 2 });
  return doc.y + 8;
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

function drawPdfLogo(doc, x, y) {
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

function drawHeader(doc, quote) {
  doc.rect(0, 0, 595.28, 116).fill(COLORS.ink);
  drawPdfLogo(doc, PAGE.left, 22);

  doc.font('Helvetica-Bold').fontSize(18).fillColor('#ffffff').text(cfBrandName || 'CF Metal-Pintura', 155, 30, { width: 240 });
  doc.font('Helvetica').fontSize(9.5).fillColor('#d9d2c6').text(cfBrandSlogan || 'Soluciones Integrales', 155, 55, { width: 240 });

  doc.font('Helvetica-Bold').fontSize(13).fillColor('#ffffff').text(`Presupuesto N.º ${text(quote.quoteNumber, '')}`, 360, 30, { width: 185, align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor('#d9d2c6').text(`Fecha: ${formatDate(quote.createdAt)}`, 360, 54, { width: 185, align: 'right' });
  doc.text(`Validez: ${formatDate(quote.validUntil)}`, 360, 70, { width: 185, align: 'right' });

  return 142;
}

function drawCostTable(doc, quote, y) {
  y = sectionTitle(doc, 'Detalle de costos', y);
  doc.rect(PAGE.left, y, PAGE.width, 24).fill(COLORS.soft);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.ink);
  doc.text('Concepto', PAGE.left + 8, y + 8, { width: 112 });
  doc.text('Descripción', PAGE.left + 126, y + 8, { width: 205 });
  doc.text('Cant.', PAGE.left + 340, y + 8, { width: 42, align: 'right' });
  doc.text('Monto', PAGE.left + 392, y + 8, { width: 95, align: 'right' });
  y += 32;

  const items = quote.items?.length ? quote.items : [];
  if (!items.length) return paragraph(doc, 'Sin ítems detallados.', y);

  for (const item of items) {
    y = ensureSpace(doc, y, 62);
    const quantity = Number(item.quantity || 1);
    const unitPrice = Number(item.unitPrice || 0);
    const total = Number(item.total || quantity * unitPrice);
    const description = [item.description, item.note].filter(Boolean).join(' · ');
    const rowHeight = Math.max(42, doc.heightOfString(description || '-', { width: 205 }) + 22);

    doc.moveTo(PAGE.left, y - 5).lineTo(PAGE.right, y - 5).strokeColor(COLORS.line).lineWidth(.5).stroke();
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(text(item.name, 'Ítem'), PAGE.left + 8, y, { width: 112 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text(text(description), PAGE.left + 126, y, { width: 205, lineGap: 2 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.ink).text(`${quantity} ${text(item.unit, '')}`, PAGE.left + 340, y, { width: 42, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(formatMoney(total), PAGE.left + 392, y, { width: 95, align: 'right' });
    y += rowHeight;
  }

  return y + 4;
}

function drawTotals(doc, quote, y) {
  y = ensureSpace(doc, y, 160);
  const x = 330;
  const w = 215;
  const rows = [
    ['Subtotal', formatMoney(quote.subtotal)],
    [`Margen (${Number(quote.profitMargin || 0)}%)`, formatMoney(Number(quote.subtotal || 0) * (Number(quote.profitMargin || 0) / 100))],
    ['Descuento', formatMoney(quote.discount)],
  ];

  if (Number(quote.materialsCost || 0)) rows.unshift(['Materiales', formatMoney(quote.materialsCost)]);
  if (Number(quote.laborCost || 0)) rows.unshift(['Mano de obra', formatMoney(quote.laborCost)]);
  if (Number(quote.paintCost || 0)) rows.unshift(['Pintura', formatMoney(quote.paintCost)]);
  if (Number(quote.extraCost || 0)) rows.unshift(['Extra / traslado', formatMoney(quote.extraCost)]);

  doc.rect(x, y, w, rows.length * 20 + 52).fill(COLORS.soft);
  let cursor = y + 12;
  rows.forEach(([label, value]) => {
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted).text(label, x + 14, cursor, { width: 95 });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.ink).text(value, x + 100, cursor, { width: 95, align: 'right' });
    cursor += 20;
  });

  doc.rect(x, cursor + 6, w, 36).fill(COLORS.ink);
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff').text('TOTAL GENERAL ESTIMADO', x + 14, cursor + 19, { width: 110 });
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#ffffff').text(formatMoney(quote.total), x + 122, cursor + 17, { width: 78, align: 'right' });
  return cursor + 58;
}

function drawFooter(doc) {
  const bottom = 786;
  doc.font('Helvetica').fontSize(8).fillColor('#9b9488').text('Atentamente, CF Metal Pintura Romanisio · Soluciones Integrales · Documento generado por CF Metal-Pintura PRO', PAGE.left, bottom, { width: PAGE.width, align: 'center' });
}

export const quotePdfService = {
  async generate(quoteId) {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
        job: true,
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });

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

      const recipient = getRecipient(quote);
      let y = drawHeader(doc, quote);

      const leftY = drawInfoLine(doc, 'Destinatario', recipient.name, PAGE.left, y);
      drawInfoLine(doc, 'Empresa', recipient.company, PAGE.left, leftY);
      drawInfoLine(doc, 'Contacto', recipient.contact, PAGE.left, doc.y + 4);
      drawInfoLine(doc, 'Administración / Dirección', [recipient.address, recipient.city, recipient.province].filter(Boolean).join(' · '), PAGE.left, doc.y + 4, 245);

      drawInfoLine(doc, 'De', 'CF Metal Pintura Romanisio', 330, y, 215);
      drawInfoLine(doc, 'Dirección', 'Pasaje Mirage 41, Las Higueras, Córdoba', 330, doc.y + 4, 215);
      drawInfoLine(doc, 'Teléfonos', '(358) 155719450 / (358) 1554283261', 330, doc.y + 4, 215);
      if (recipient.phone || recipient.email || recipient.taxId) {
        drawInfoLine(doc, 'Datos cliente', [recipient.phone, recipient.email, recipient.taxId].filter(Boolean).join(' · '), 330, doc.y + 4, 215);
      }

      y = Math.max(doc.y + 18, 270);
      y = sectionTitle(doc, 'Detalle del trabajo solicitado', y);
      y = paragraph(doc, quote.workObject ? `Objeto: ${quote.workObject}` : quote.title, y, { bold: Boolean(quote.workObject), color: COLORS.ink });
      if (quote.workLocation) y = paragraph(doc, `Ubicación de obra: ${quote.workLocation}`, y, { color: COLORS.ink });
      y = paragraph(doc, quote.description, y);

      if (quote.includedTasks) {
        y = sectionTitle(doc, 'Alcance / tareas incluidas', y);
        y = bulletList(doc, quote.includedTasks, y);
      }

      y = drawCostTable(doc, quote, y);
      y = drawTotals(doc, quote, y);

      const conditions = [
        quote.excludedTasks,
        quote.technicalNotes,
        quote.paymentTerms ? `Forma de pago: ${quote.paymentTerms}` : '',
        quote.executionTime ? `Plazo estimado: ${quote.executionTime}` : '',
        quote.warranty ? `Garantía: ${quote.warranty}` : '',
        quote.commercialConditions,
      ].filter(Boolean).join('\n');

      if (conditions) {
        y = sectionTitle(doc, 'Condiciones', y + 12);
        y = bulletList(doc, conditions, y);
      }

      if (quote.internalNotes) {
        y = sectionTitle(doc, 'Observaciones internas / comerciales', y + 6);
        y = paragraph(doc, quote.internalNotes, y);
      }

      drawFooter(doc);
      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    const updated = await prisma.quote.update({
      where: { id: quoteId },
      data: { pdfUrl: publicUrl },
      include: { client: true, job: true, items: true, pdfDocuments: true },
    });

    return { quote: updated, filePath, fileName, publicUrl };
  },
};