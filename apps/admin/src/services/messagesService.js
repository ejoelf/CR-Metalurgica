import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const messagesService = {
  async list(params = {}) {
    return apiClient(`/contact-messages${buildQuery(params)}`);
  },

  async unreadCount() {
    return apiClient('/contact-messages/unread-count');
  },

  async getById(id) {
    return apiClient(`/contact-messages/${id}`);
  },

  async markAsRead(id) {
    return apiClient(`/contact-messages/${id}/read`, {
      method: 'PATCH',
    });
  },

  async updateStatus(id, status) {
    return apiClient(`/contact-messages/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async convertToClient(id) {
    return apiClient(`/contact-messages/${id}/convert-to-client`, {
      method: 'POST',
    });
  },

  async remove(id) {
    return apiClient(`/contact-messages/${id}`, {
      method: 'DELETE',
    });
  },
};
