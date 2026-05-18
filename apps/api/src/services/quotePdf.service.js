import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { cfBrandName, cfLogoDataUrl } from '../../../../packages/branding/cfLogo.js';

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

function dataUrlToBuffer(dataUrl) {
  const base64 = String(dataUrl || '').split(',')[1];
  return base64 ? Buffer.from(base64, 'base64') : null;
}

function drawRow(doc, label, value, y, options = {}) {
  const left = options.left || 58;
  const right = options.right || 390;
  doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(label, left, y, { width: 260 });
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827').text(value, right, y, { width: 150, align: 'right' });
}

function drawSeparator(doc, y) {
  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(58, y).lineTo(535, y).stroke();
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
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const logoBuffer = dataUrlToBuffer(cfLogoDataUrl);
      if (logoBuffer) {
        doc.image(logoBuffer, 58, 40, { width: 62, height: 62 });
      }

      doc.font('Helvetica-Bold').fontSize(20).fillColor('#111827').text(cfBrandName || 'CF Metal-Pintura', 135, 45);
      doc.font('Helvetica').fontSize(10).fillColor('#6b7280').text('Presupuesto profesional de herrería, metalúrgica y pintura', 135, 72);
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#d8843f').text(quote.quoteNumber || 'Presupuesto', 390, 45, { width: 145, align: 'right' });
      doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(`Emitido: ${formatDate(quote.createdAt)}`, 390, 68, { width: 145, align: 'right' });
      doc.text(`Validez: ${formatDate(quote.validUntil)}`, 390, 84, { width: 145, align: 'right' });

      drawSeparator(doc, 120);

      doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text('Datos del cliente', 58, 142);
      doc.font('Helvetica').fontSize(10).fillColor('#374151').text(quote.client?.fullName || 'Cliente no informado', 58, 165);
      doc.fillColor('#6b7280').text(`Teléfono: ${quote.client?.phone || '-'}`, 58, 182);
      doc.text(`Email: ${quote.client?.email || '-'}`, 58, 197);
      doc.text(`Dirección: ${quote.client?.address || '-'} ${quote.client?.city ? `· ${quote.client.city}` : ''}`, 58, 212);

      doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text('Presupuesto', 315, 142);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#374151').text(quote.title || '-', 315, 165, { width: 220 });
      doc.font('Helvetica').fontSize(10).fillColor('#6b7280').text(`Trabajo relacionado: ${quote.job?.title || '-'}`, 315, 190, { width: 220 });
      doc.text(`Estado: ${quote.status || 'draft'}`, 315, 205, { width: 220 });

      drawSeparator(doc, 245);

      doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text('Detalle de ítems', 58, 265);
      let y = 292;
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#6b7280');
      doc.text('Concepto', 58, y);
      doc.text('Cant.', 330, y, { width: 45, align: 'right' });
      doc.text('Unitario', 390, y, { width: 70, align: 'right' });
      doc.text('Total', 465, y, { width: 70, align: 'right' });
      y += 18;
      drawSeparator(doc, y);
      y += 10;

      const items = quote.items?.length ? quote.items : [];
      if (!items.length) {
        doc.font('Helvetica').fontSize(10).fillColor('#6b7280').text('Sin ítems detallados.', 58, y);
        y += 20;
      }

      items.forEach((item) => {
        if (y > 700) {
          doc.addPage();
          y = 60;
        }
        const quantity = Number(item.quantity || 1);
        const unitPrice = Number(item.unitPrice || 0);
        const total = Number(item.total || quantity * unitPrice);
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827').text(item.name || 'Ítem', 58, y, { width: 250 });
        if (item.description) doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text(item.description, 58, y + 13, { width: 250 });
        doc.font('Helvetica').fontSize(9).fillColor('#374151').text(String(quantity), 330, y, { width: 45, align: 'right' });
        doc.text(formatMoney(unitPrice), 390, y, { width: 70, align: 'right' });
        doc.font('Helvetica-Bold').text(formatMoney(total), 465, y, { width: 70, align: 'right' });
        y += item.description ? 36 : 24;
      });

      y += 12;
      drawSeparator(doc, y);
      y += 18;

      const totalsY = Math.max(y, 560);
      drawRow(doc, 'Materiales', formatMoney(quote.materialsCost), totalsY);
      drawRow(doc, 'Mano de obra', formatMoney(quote.laborCost), totalsY + 18);
      drawRow(doc, 'Pintura', formatMoney(quote.paintCost), totalsY + 36);
      drawRow(doc, 'Extra / traslado / viáticos', formatMoney(quote.extraCost), totalsY + 54);
      drawRow(doc, 'Subtotal', formatMoney(quote.subtotal), totalsY + 78);
      drawRow(doc, `Margen (${Number(quote.profitMargin || 0)}%)`, formatMoney(Number(quote.subtotal || 0) * (Number(quote.profitMargin || 0) / 100)), totalsY + 96);
      drawRow(doc, 'Descuento', formatMoney(quote.discount), totalsY + 114);

      doc.rect(58, totalsY + 140, 477, 42).fill('#111827');
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff').text('TOTAL FINAL', 75, totalsY + 154);
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text(formatMoney(quote.total), 350, totalsY + 151, { width: 165, align: 'right' });

      if (quote.description || quote.internalNotes) {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#111827').text('Notas', 58, totalsY + 205);
        doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(quote.description || quote.internalNotes || '', 58, totalsY + 222, { width: 477 });
      }

      doc.font('Helvetica').fontSize(8).fillColor('#9ca3af').text('Documento generado por CF Metal-Pintura PRO · NexoDigital', 58, 790, { width: 477, align: 'center' });

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
