import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';
import { buildQuotePdfContent, formatDate, formatMoney } from './quotePdfTemplate.js';
import { buildPdfPublicUrl, createPdfToken, ensurePdfStorage } from './pdfStorage.service.js';

export async function generateQuotePdf(quoteId) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { client: true, job: true, items: true },
  });

  if (!quote) {
    throw notFound('Presupuesto no encontrado');
  }

  const company = await prisma.businessSettings.findFirst();
  const content = buildQuotePdfContent({ quote, client: quote.client, company });
  const directory = await ensurePdfStorage();
  const token = createPdfToken();
  const fileName = `presupuesto-${quote.quoteNumber}.pdf`.replace(/[^a-zA-Z0-9-.]/g, '-');
  const filePath = path.join(directory, `${token}-${fileName}`);
  const publicUrl = buildPdfPublicUrl(token);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).fillColor('#111827').text(content.company.name, { align: 'left' });
    doc.fontSize(10).fillColor('#64748b').text(content.company.address);
    doc.text(`Tel: ${content.company.phone} | Email: ${content.company.email}`);
    doc.moveDown(1.4);

    doc.fontSize(18).fillColor('#111827').text(content.title);
    doc.fontSize(10).fillColor('#64748b').text(`Fecha: ${formatDate(content.quote.createdAt)} | Validez: ${formatDate(content.quote.validUntil)}`);
    doc.moveDown(1.2);

    doc.fontSize(12).fillColor('#111827').text('Cliente', { underline: true });
    doc.fontSize(10).fillColor('#334155').text(content.client.name);
    doc.text(`Tel: ${content.client.phone}`);
    doc.text(`Email: ${content.client.email || '-'}`);
    doc.text(`Dirección: ${content.client.address || '-'}`);
    doc.moveDown(1.2);

    doc.fontSize(12).fillColor('#111827').text('Detalle del presupuesto', { underline: true });
    doc.moveDown(0.5);

    content.items.forEach((item, index) => {
      const total = Number(item.total || 0);
      doc.fontSize(10).fillColor('#111827').text(`${index + 1}. ${item.name}`);
      if (item.description) doc.fillColor('#64748b').text(item.description);
      doc.fillColor('#334155').text(`Cantidad: ${item.quantity} | Unitario: ${formatMoney(item.unitPrice)} | Total: ${formatMoney(total)}`);
      doc.moveDown(0.4);
    });

    doc.moveDown(1);
    doc.fontSize(11).fillColor('#111827').text(`Materiales: ${formatMoney(content.quote.materialsCost)}`, { align: 'right' });
    doc.text(`Mano de obra: ${formatMoney(content.quote.laborCost)}`, { align: 'right' });
    doc.text(`Pintura/Insumos: ${formatMoney(content.quote.paintCost)}`, { align: 'right' });
    doc.text(`Extras: ${formatMoney(content.quote.extraCost)}`, { align: 'right' });
    doc.text(`Subtotal: ${formatMoney(content.quote.subtotal)}`, { align: 'right' });
    doc.text(`Descuento: ${formatMoney(content.quote.discount)}`, { align: 'right' });
    doc.fontSize(15).fillColor('#111827').text(`TOTAL: ${formatMoney(content.quote.total)}`, { align: 'right' });

    doc.moveDown(1.5);
    doc.fontSize(9).fillColor('#64748b').text('Presupuesto generado por CF Metal Pintura PRO. Los precios y condiciones están sujetos a revisión según medidas finales, materiales y disponibilidad.', { align: 'left' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  const pdfDocument = await prisma.pdfDocument.create({
    data: {
      quoteId: quote.id,
      fileName,
      filePath,
      publicUrl,
      token,
    },
  });

  await prisma.quote.update({ where: { id: quote.id }, data: { pdfUrl: publicUrl } });

  return { success: true, fileName, filePath, publicUrl, token, pdfDocument };
}
