export function generateCommercialText(input = {}) {
  const service = input.service || 'trabajo a medida';
  const tone = input.tone || 'profesional';
  const clientName = input.clientName || 'cliente';

  return {
    whatsapp: `Hola ${clientName}, gracias por consultar por ${service}. Para avanzar con un presupuesto preciso necesitamos medidas aproximadas, ubicación y una foto o referencia del trabajo.`,
    shortAd: `CF Metal Pintura: soluciones profesionales en ${service}, con trabajos a medida, terminaciones prolijas y atención directa.`,
    formal: `Estimado/a ${clientName}, gracias por contactar a CF Metal Pintura. Revisaremos la información enviada para preparar una propuesta clara y adaptada a sus necesidades.`,
    tone,
  };
}
