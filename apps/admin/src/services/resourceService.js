import { apiClient } from './apiClient.js';

export function createResourceService(basePath) {
  return {
    list() {
      return apiClient(basePath);
    },
    detail(id) {
      return apiClient(`${basePath}/${id}`);
    },
    create(payload) {
      return apiClient(basePath, { method: 'POST', body: JSON.stringify(payload) });
    },
    update(id, payload) {
      return apiClient(`${basePath}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    },
    remove(id) {
      return apiClient(`${basePath}/${id}`, { method: 'DELETE' });
    },
  };
}

export const clientsService = createResourceService('/clients');
export const jobsService = createResourceService('/jobs');
export const quotesService = createResourceService('/quotes');
export const incomesService = createResourceService('/incomes');
export const expensesService = createResourceService('/expenses');
export const agendaService = createResourceService('/agenda');
export const galleryService = createResourceService('/gallery');
export const messagesService = createResourceService('/contact-messages');
export const notificationsService = createResourceService('/notifications');
