export const cfBrandName = 'CF Metal-Pintura';
export const cfBrandSlogan = 'Soluciones Integrales';

export const cfLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 560" role="img" aria-label="CF Metal-Pintura Soluciones Integrales">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="920" height="560" fill="#393b39"/>
  <g filter="url(#shadow)" fill="#f7f7f4">
    <path d="M175 236 476 42c9-6 21-6 30 1l145 116 104 76v60L501 92c-6-5-15-5-21 0L175 295Z"/>
    <path d="M235 272 460 128v260H235Z"/>
    <path d="M481 123h90v264h-90Z"/>
    <path d="M593 188h84v199h-84Z"/>
    <path d="M230 202h85c9 0 16 7 16 16v36H230Z"/>
    <path d="M229 128h86c9 0 16 7 16 16v22c0 9-7 16-16 16h-86c-9 0-16-7-16-16v-22c0-9 7-16 16-16Z"/>
    <path d="M456 285c-29-13-47-40-47-71v-50h20v51c0 19 13 36 32 40 8 2 17 2 25 0 19-4 32-21 32-40v-51h20v50c0 31-18 58-47 71v118h-35Z"/>
    <path d="M441 404c0-18 15-33 33-33s33 15 33 33Z"/>
    <path d="M287 251c13-32 29-32 42 0 12-32 29-32 42 0 8-16 20-23 34-21v39H287Z" fill="#393b39"/>
    <path d="M284 283h121v18H284Z" fill="#393b39"/>
    <path d="M285 322h121v22H285Z" fill="#393b39"/>
    <path d="M287 344c3 22 18 39 43 49v57h31v-57c25-10 40-27 43-49Z"/>
    <path d="M627 258h95c10 0 18 8 18 18v25c0 10-8 18-18 18h-95c-10 0-18-8-18-18v-25c0-10 8-18 18-18Z" fill="#393b39"/>
    <path d="M620 240c0-18 15-33 33-33h40c8 0 15-7 15-15v-9c0-8 7-15 15-15h11c8 0 15 7 15 15v29" fill="none" stroke="#393b39" stroke-width="15" stroke-linecap="round"/>
    <path d="M635 320h14v49h-14Zm32 0h14v49h-14Zm32 0h14v49h-14Zm32-102h12v95h-12Z" fill="#393b39"/>
    <path d="M454 325h94v94h-94Z" fill="#393b39"/>
    <text x="484" y="421" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="174" font-weight="900" letter-spacing="-16">CF</text>
    <text x="460" y="503" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="52" font-weight="900" letter-spacing="8">METAL-PINTURA</text>
    <text x="460" y="543" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="12">SOLUCIONES INTEGRALES</text>
    <rect x="150" y="529" width="120" height="4"/>
    <rect x="650" y="529" width="120" height="4"/>
  </g>
</svg>`;

export const cfLogoMimeType = 'image/svg+xml';
export const cfLogoDataUrl = `data:${cfLogoMimeType};utf8,${encodeURIComponent(cfLogoSvg)}`;

export function applyLogoFallback(event) {
  const image = event?.currentTarget;
  if (!image) return;
  if (image.src !== cfLogoDataUrl) image.src = cfLogoDataUrl;
}
