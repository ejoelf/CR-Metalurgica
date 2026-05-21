const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4000/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function resolveAssetUrl(value = '') {
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  return `${API_ORIGIN}${value}`;
}
