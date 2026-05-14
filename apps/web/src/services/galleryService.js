import { apiClient } from './apiClient.js';

export async function getPublicGallery() {
  const response = await apiClient('/gallery/public');
  return response.data || [];
}
