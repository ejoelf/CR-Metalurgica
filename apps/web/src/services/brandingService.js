const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:4000/api';

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function resolveAssetUrl(value = '') {
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  return `${API_ORIGIN}${value}`;
}

export async function getPublicBranding() {
  const response = await fetch(`${API_URL}/public/branding`);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || 'No se pudo cargar el branding público');
  }

  return payload?.data || payload;
}
