export function buildEmailLayout({ title, preview, body }) {
  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
      </head>
      <body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#111827;">
        <span style="display:none;color:transparent;opacity:0;height:0;width:0;overflow:hidden;">${preview || ''}</span>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:28px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:28px;background:#0f172a;color:#ffffff;">
                    <h1 style="margin:0;font-size:24px;">CF Metal Pintura</h1>
                    <p style="margin:8px 0 0;color:#cbd5e1;">Sistema PRO de gestión</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    ${body}
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 28px;background:#f8fafc;color:#64748b;font-size:13px;">
                    Este mensaje fue generado por CF Metal Pintura PRO.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function quoteEmailTemplate({ clientName, quoteNumber, quoteUrl }) {
  return buildEmailLayout({
    title: `Presupuesto ${quoteNumber}`,
    preview: 'Tu presupuesto de CF Metal Pintura está listo.',
    body: `
      <h2 style="margin:0 0 12px;font-size:22px;">Hola ${clientName || 'cliente'},</h2>
      <p style="line-height:1.7;color:#334155;">Ya tenemos listo tu presupuesto <strong>${quoteNumber}</strong>.</p>
      <p style="line-height:1.7;color:#334155;">Podés revisarlo desde el siguiente enlace:</p>
      <p><a href="${quoteUrl}" style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;font-weight:bold;padding:12px 18px;border-radius:999px;">Ver presupuesto</a></p>
    `,
  });
}

export function internalNotificationEmailTemplate({ title, message }) {
  return buildEmailLayout({
    title,
    preview: message,
    body: `
      <h2 style="margin:0 0 12px;font-size:22px;">${title}</h2>
      <p style="line-height:1.7;color:#334155;">${message}</p>
    `,
  });
}
