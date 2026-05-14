const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4000/api';

export async function apiClient(path, options = {}) {
  const token = localStorage.getItem('cfmp_access_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const response = await fetch(API_URL + path, { ...options, headers });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || 'No se pudo completar la solicitud');
  }

  return payload?.data ?? payload;
}
