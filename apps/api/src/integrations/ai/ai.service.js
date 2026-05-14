import { prisma } from '../../config/prisma.js';
import { generateQuoteSuggestions } from './ai.quoteSuggestions.js';
import { generateCommercialText } from './ai.commercialText.js';
import { generateMaterialSuggestions } from './ai.materialEstimator.js';

async function persistSuggestion(type, input, output) {
  return prisma.aiSuggestion.create({
    data: { type, input, output },
  });
}

export const ai = {
  async generateQuoteSuggestions(input = {}) {
    const output = generateQuoteSuggestions(input);
    await persistSuggestion('quote_suggestions', input, output);
    return output;
  },

  async generateCommercialText(input = {}) {
    const output = generateCommercialText(input);
    await persistSuggestion('commercial_text', input, output);
    return output;
  },

  async generateMaterialSuggestions(input = {}) {
    const output = generateMaterialSuggestions(input);
    await persistSuggestion('material_suggestions', input, output);
    return output;
  },

  async analyzeJob(input = {}) {
    const materials = generateMaterialSuggestions(input);
    const output = {
      complexity: materials.length > 5 ? 'high' : 'normal',
      suggestedMaterials: materials,
      notes: ['Validar medidas finales', 'Confirmar disponibilidad de materiales', 'Revisar tiempos de producción'],
    };
    await persistSuggestion('job_analysis', input, output);
    return output;
  },
};
