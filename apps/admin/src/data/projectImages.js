import portonDoble from '../../../../src/assets/projects/PortonDoble.jpeg';
import portonEstandar from '../../../../src/assets/projects/PortonEstandar.jpeg';
import cocheraGaleria from '../../../../src/assets/projects/CocheraGaleria.jpeg';
import carteleria from '../../../../src/assets/projects/Carteleria.jpeg';

const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const projectImages = {
  portonDoble,
  portonEstandar,
  cocheraGaleria,
  carteleria,
};

export function resolveProjectImage(imageUrl) {
  if (!imageUrl) return cocheraGaleria;

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/storage/') || imageUrl.startsWith('/uploads/')) {
    return `${API_ORIGIN}${imageUrl}`;
  }

  const normalized = imageUrl.toLowerCase();

  if (normalized.includes('portondoble')) return portonDoble;
  if (normalized.includes('portonestandar')) return portonEstandar;
  if (normalized.includes('cocheragaleria')) return cocheraGaleria;
  if (normalized.includes('carteleria')) return carteleria;

  return imageUrl;
}
