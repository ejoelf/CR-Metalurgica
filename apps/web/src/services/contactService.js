import { apiClient } from './apiClient.js';

export async function sendContactMessage(payload) {
  const response = await apiClient('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}
