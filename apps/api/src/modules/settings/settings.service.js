import { prisma } from '../../config/prisma.js';

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
        quoteDefaultValidityDays: 15,
        defaultProfitMargin: 0,
      },
    });
  },

  async updateBusinessSettings(data) {
    const existing = await this.getBusinessSettings();
    return prisma.businessSettings.update({
      where: { id: existing.id },
      data,
    });
  },
};
