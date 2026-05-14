import portonDoble from '../../../../src/assets/projects/PortonDoble.jpeg';
import portonEstandar from '../../../../src/assets/projects/PortonEstandar.jpeg';
import cocheraGaleria from '../../../../src/assets/projects/CocheraGaleria.jpeg';
import carteleria from '../../../../src/assets/projects/Carteleria.jpeg';

export const projectImages = {
  portonDoble,
  portonEstandar,
  cocheraGaleria,
  carteleria,
};

export function resolveProjectImage(imageUrl) {
  if (!imageUrl) return cocheraGaleria;

  const normalized = imageUrl.toLowerCase();

  if (normalized.includes('portondoble')) return portonDoble;
  if (normalized.includes('portonestandar')) return portonEstandar;
  if (normalized.includes('cocheragaleria')) return cocheraGaleria;
  if (normalized.includes('carteleria')) return carteleria;

  return imageUrl;
}
