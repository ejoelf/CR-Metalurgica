export function generateQuoteSuggestions(input = {}) {
  const serviceType = String(input.serviceType || '').toLowerCase();
  const complexity = input.complexity || 'normal';

  const baseSuggestions = {
    suggestedMargin: complexity === 'high' ? 25 : complexity === 'low' ? 12 : 18,
    suggestedValidityDays: 15,
    warnings: [],
    items: [],
  };

  if (serviceType.includes('porton') || serviceType.includes('metal')) {
    baseSuggestions.items.push('Revisar medidas exactas', 'Calcular hierro/perfiles', 'Incluir pintura antioxidante', 'Considerar instalación');
  }

  if (serviceType.includes('pintura')) {
    baseSuggestions.items.push('Calcular metros cuadrados', 'Definir tipo de pintura', 'Incluir preparación de superficie');
  }

  if (serviceType.includes('durlock')) {
    baseSuggestions.items.push('Calcular placas', 'Perfilería', 'Masillado', 'Terminación');
  }

  if (!input.description) {
    baseSuggestions.warnings.push('Falta una descripción detallada del trabajo.');
  }

  return baseSuggestions;
}
