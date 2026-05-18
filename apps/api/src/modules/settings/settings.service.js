import { prisma } from '../../config/prisma.js';

const allowedFields = [
  'businessName',
  'publicName',
  'legalName',
  'taxId',
  'email',
  'phone',
  'whatsapp',
  'address',
  'city',
  'province',
  'country',
  'website',
  'logoUrl',
  'instagramUrl',
  'facebookUrl',
  'googleMapsUrl',
  'defaultTaxRate',
  'defaultMargin',
  'defaultProfitMargin',
  'quoteValidityDays',
  'quoteDefaultValidityDays',
];

function normalizeSettingsPayload(data = {}) {
  const payload = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) payload[field] = data[field];
  });

  ['defaultTaxRate', 'defaultMargin', 'defaultProfitMargin'].forEach((field) => {
    if (payload[field] !== undefined) payload[field] = Number(payload[field] || 0);
  });

  ['quoteValidityDays', 'quoteDefaultValidityDays'].forEach((field) => {
    if (payload[field] !== undefined) payload[field] = Number(payload[field] || 15);
  });

  return payload;
}

export const settingsService = {
  async getBusinessSettings() {
    const existing = await prisma.businessSettings.findFirst();

    if (existing) return existing;

    return prisma.businessSettings.create({
      data: {
        businessName: 'CF Metal Pintura',
        publicName: 'CF Metal Pintura',
        phone: '(0358) 155719450',
        whatsapp: '5493585719450',
        email: 'cesarromanisio6@gmail.com',
        address: 'Las Higueras, Rio Cuarto, Cordoba, Argentina',
        city: 'Las Higueras',
        province: 'Cordoba',
        country: 'Argentina',
        instagramUrl: 'https://www.instagram.com/cesarromanisio/',
        facebookUrl: 'https://www.facebook.com/CesarRomanisioHig',
        googleMapsUrl: 'https://maps.app.goo.gl/etKxF4gzr3Wg45W6A',
        quoteDefaultValidityDays: 15,
        quoteValidityDays: 15,
        defaultTaxRate: 21,
        defaultMargin: 15,
        defaultProfitMargin: 15,
      },
    });
  },

  async updateBusinessSettings(data) {
    const existing = await this.getBusinessSettings();
    const payload = normalizeSettingsPayload(data);

    return prisma.businessSettings.update({
      where: { id: existing.id },
      data: payload,
    });
  },
};
