import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { env } from '../config/env.js';
import { cfBrandName, cfLogoDataUrl } from '../../../../packages/branding/cfLogo.js';
import { financeService } from '../modules/finance/finance.service.js';

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

function safeFilePart(value) {
  return String(value || '').replace(/[^a-zA-Z0-9-_]/g, '-');
}

function getReportLabel(query = {}) {
  if (query.date) return `Día ${formatDate(`${query.date}T00:00:00`)}`;
  const year = query.year || new Date().getFullYear();
  const month = query.month || new Date().getMonth() + 1;
  return `Mes ${String(month).padStart(2, '0')}/${year}`;
}

export const financePdfService = {
  async generate(query = {}) {
    const [summary, movements] = await Promise.all([
      financeService.summary(query),
      financeService.movements(query),
    ]);

    const storagePath = path.resolve(process.cwd(), env.pdfStoragePath, 'finance');
    ensureDir(storagePath);

    const stamp = query.date ? safeFilePart(query.date) : `${safeFilePart(query.year || new Date().getFullYear())}-${safeFilePart(query.month || new Date().getMonth() + 1)}`;
    const fileName = `finanzas-${stamp}-${Date.now()}.pdf`;
    const filePath = path.join(storagePath, fileName);
    const publicUrl = `/storage/pdfs/finance/${fileName}`;
    const reportLabel = getReportLabel(query);

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const logoBuffer = dataUrlToBuffer(cfLogoDataUrl);
      if (logoBuffer) doc.image(logoBuffer, 58, 40, { width: 58, height: 58 });

      doc.font('Helvetica-Bold').fontSize(20).fillColor('#111827').text(cfBrandName || 'CF Metal-Pintura', 130, 45);
      doc.font('Helvetica').fontSize(10).fillColor('#6b7280').text('Reporte financiero', 130, 72);
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#d8843f').text(reportLabel, 390, 45, { width: 145, align: 'right' });
      doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(`Generado: ${formatDate(new Date())}`, 390, 68, { width: 145, align: 'right' });

      doc.strokeColor('#e5e7eb').moveTo(58, 120).lineTo(535, 120).stroke();

      doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text('Resumen', 58, 145);
      const cards = [
        ['Ingresos cobrados', summary.totalIncome],
        ['Egresos', summary.totalExpenses],
        ['Balance', summary.balance],
        ['Ingresos pendientes', summary.pendingIncome],
      ];

      let x = 58;
      cards.forEach(([label, value], index) => {
        const y = index < 2 ? 172 : 236;
        x = index % 2 === 0 ? 58 : 306;
        doc.rect(x, y, 229, 46).strokeColor('#e5e7eb').stroke();
        doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text(label, x + 12, y + 10, { width: 130 });
        doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text(formatMoney(value), x + 12, y + 25, { width: 190 });
      });

      let y = 320;
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text('Movimientos del período', 58, y);
      y += 28;
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#6b7280');
      doc.text('Fecha', 58, y, { width: 70 });
      doc.text('Tipo', 130, y, { width: 60 });
      doc.text('Título', 195, y, { width: 185 });
      doc.text('Relación', 382, y, { width: 90 });
      doc.text('Monto', 475, y, { width: 60, align: 'right' });
      y += 14;
      doc.strokeColor('#e5e7eb').moveTo(58, y).lineTo(535, y).stroke();
      y += 8;

      if (!movements.length) {
        doc.font('Helvetica').fontSize(10).fillColor('#6b7280').text('No hay movimientos registrados en este período.', 58, y);
      }

      movements.forEach((item) => {
        if (y > 745) {
          doc.addPage();
          y = 60;
        }

        const typeLabel = item.movementType === 'income' ? 'Ingreso' : 'Egreso';
        const relation = item.client?.fullName || item.job?.title || item.quote?.title || '-';
        const amount = `${item.movementType === 'income' ? '+' : '-'} ${formatMoney(item.amount)}`;
        doc.font('Helvetica').fontSize(8).fillColor('#374151');
        doc.text(formatDate(item.movementDate), 58, y, { width: 70 });
        doc.text(typeLabel, 130, y, { width: 60 });
        doc.text(item.title || '-', 195, y, { width: 185 });
        doc.text(relation, 382, y, { width: 90 });
        doc.font('Helvetica-Bold').fillColor(item.movementType === 'income' ? '#166534' : '#991b1b').text(amount, 475, y, { width: 60, align: 'right' });
        y += 20;
      });

      doc.font('Helvetica').fontSize(8).fillColor('#9ca3af').text('Documento generado por CF Metal-Pintura PRO · NexoDigital', 58, 790, { width: 477, align: 'center' });
      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return { fileName, filePath, publicUrl, summary, movementsCount: movements.length };
  },
};
