export const cfBrandName = 'CF Metal-Pintura';
export const cfBrandSlogan = 'Metal y Pintura';

export const cfLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" role="img" aria-label="CF Metal y Pintura">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#101a2b"/>
      <stop offset="0.55" stop-color="#071121"/>
      <stop offset="1" stop-color="#020713"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.38" stop-color="#f4f7fb"/>
      <stop offset="0.68" stop-color="#aab6c6"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="darkSteel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1b2c47"/>
      <stop offset="1" stop-color="#061020"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="960" height="620" rx="34" fill="url(#bg)"/>
  <g opacity="0.22" stroke="#ffffff" stroke-width="1">
    <path d="M80 74h800M80 546h800M70 105h820M70 515h820"/>
  </g>

  <g filter="url(#shadow)">
    <path d="M236 315a248 248 0 0 1 488 0h-78a172 172 0 0 0-332 0Z" fill="url(#darkSteel)" stroke="#e8eef8" stroke-width="10"/>
    <g fill="#101a2b" stroke="#e8eef8" stroke-width="8">
      <path d="M443 54h74l8 76h-90Z"/>
      <path d="M314 84l65-20 31 69-86 26Z"/>
      <path d="M581 64l65 20-10 75-86-26Z"/>
      <path d="M705 143l54 48-42 64-68-61Z"/>
      <path d="M201 191l54-48 56 51-68 61Z"/>
    </g>

    <g transform="translate(152 154) rotate(-38 110 110)" stroke="#e8eef8" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="#101a2b">
      <path d="M40 30c28-20 65-20 94 0l-40 39 32 32 40-39c20 30 18 69-7 97-31 35-85 37-118 4-33-33-31-86-1-133Z"/>
      <path d="M116 119l132 132"/>
    </g>

    <g transform="translate(674 156) rotate(36 110 110)" stroke="#e8eef8" stroke-width="16" stroke-linejoin="round" fill="#101a2b">
      <path d="M90 34h74c18 0 32 14 32 32v30H58V66c0-18 14-32 32-32Z"/>
      <path d="M75 96h104v72H75Z"/>
      <path d="M106 168h42v132h-42Z"/>
      <path d="M92 300h72v40H92Z"/>
    </g>

    <path d="M110 384h740l42 58-42 58H110l-42-58Z" fill="#061020" stroke="#eef4ff" stroke-width="10"/>
    <path d="M128 403h704" stroke="#eef4ff" stroke-width="6" opacity="0.35"/>
    <path d="M128 481h704" stroke="#eef4ff" stroke-width="6" opacity="0.35"/>

    <text x="480" y="348" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="214" font-weight="900" letter-spacing="-22" fill="url(#steel)" stroke="#071121" stroke-width="10">CF</text>
    <text x="480" y="462" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="62" font-weight="900" letter-spacing="5" fill="#ffffff">METAL Y PINTURA</text>

    <g filter="url(#glow)" fill="#ffffff">
      <path d="M470 274 486 318 530 334 486 350 470 394 454 350 410 334 454 318Z"/>
      <path d="M615 195 623 218 646 226 623 234 615 257 607 234 584 226 607 218Z" opacity="0.85"/>
    </g>

    <path d="M245 522c90 54 169 73 235 73s145-19 235-73" fill="none" stroke="#eef4ff" stroke-width="14" stroke-linecap="round" opacity="0.9"/>
    <path d="M330 542c54 23 104 34 150 34s96-11 150-34" fill="none" stroke="#4b5f7d" stroke-width="12" stroke-linecap="round"/>
  </g>
</svg>`;

export const cfLogoMimeType = 'image/svg+xml';
export const cfLogoDataUrl = `data:${cfLogoMimeType};utf8,${encodeURIComponent(cfLogoSvg)}`;

export function applyLogoFallback(event) {
  const image = event?.currentTarget;
  if (!image) return;
  if (image.src !== cfLogoDataUrl) image.src = cfLogoDataUrl;
}
