export function generateMaterialSuggestions(input = {}) {
  const description = String(input.description || '').toLowerCase();
  const suggestions = [];

  if (description.includes('porton') || description.includes('portón')) {
    suggestions.push('Perfiles estructurales', 'Chapa', 'Bisagras o sistema levadizo', 'Soldadura', 'Antióxido', 'Pintura final');
  }

  if (description.includes('reja')) {
    suggestions.push('Hierro macizo o tubo', 'Planchuelas', 'Anclajes', 'Soldadura', 'Pintura protectora');
  }

  if (description.includes('pintura')) {
    suggestions.push('Lija', 'Sellador o fijador', 'Pintura', 'Rodillos/pinceles', 'Cinta de enmascarar');
  }

  if (description.includes('durlock')) {
    suggestions.push('Placas de yeso', 'Soleras y montantes', 'Tornillos', 'Masilla', 'Cinta tramada');
  }

  return suggestions.length ? suggestions : ['Relevar medidas', 'Definir materiales', 'Calcular mano de obra', 'Validar terminación'];
}
