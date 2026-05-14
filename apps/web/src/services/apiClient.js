const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiClient(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'No se pudo completar la solicitud');
  }

  return data;
}
