import { apiClient } from './apiClient.js';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}

export const uploadsService = {
  async uploadImage(file) {
    if (!file) throw new Error('Seleccioná una imagen');
    if (!file.type?.startsWith('image/')) throw new Error('El archivo debe ser una imagen');

    const dataUrl = await fileToDataUrl(file);
    return apiClient('/uploads/image', {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        dataUrl,
      }),
    });
  },
};
