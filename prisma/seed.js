import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@cfmetalpintura.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMeAdmin123';
const SUPPORT_EMAIL = process.env.SEED_SUPPORT_EMAIL || 'soporte@nexodigital.tech';
const SUPPORT_PASSWORD = process.env.SEED_SUPPORT_PASSWORD || 'ChangeMeSupport123';

async function main() {
  console.log('Iniciando seed CF Metal Pintura PRO...');

  const roles = [
    { name: 'super_admin', description: 'Acceso tecnico total del sistema.' },
    { name: 'admin', description: 'Administrador principal del negocio.' },
    { name: 'staff', description: 'Colaborador interno con permisos operativos.' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({ where: { name: role.name }, update: role, create: role });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'super_admin' } });

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: 'Administrador CF Metal Pintura', roleId: adminRole.id, isActive: true },
    create: {
      name: 'Administrador CF Metal Pintura',
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      roleId: adminRole.id,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: SUPPORT_EMAIL },
    update: { name: 'Soporte NexoDigital', roleId: superAdminRole.id, isActive: true },
    create: {
      name: 'Soporte NexoDigital',
      email: SUPPORT_EMAIL,
      passwordHash: await bcrypt.hash(SUPPORT_PASSWORD, 12),
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  const settings = await prisma.businessSettings.findFirst();

  if (!settings) {
    await prisma.businessSettings.create({
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
        googleMapsUrl: 'https://www.google.com/maps',
        quoteDefaultValidityDays: 15,
        defaultProfitMargin: 0,
      },
    });
  }

  const adminUser = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  const client = await prisma.client.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      fullName: 'Cliente de ejemplo',
      phone: '3580000000',
      email: 'cliente@ejemplo.com',
      address: 'Las Higueras, Cordoba',
      city: 'Las Higueras',
      source: 'seed',
      status: 'lead',
      notes: 'Cliente inicial para pruebas del CRM.',
    },
  });

  const job = await prisma.job.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      clientId: client.id,
      title: 'Porton levadizo de ejemplo',
      description: 'Trabajo inicial de referencia para probar el flujo operativo.',
      serviceType: 'Metalurgica',
      status: 'pending',
      priority: 'normal',
      estimatedPrice: 250000,
      createdById: adminUser.id,
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: 'P-0001' },
    update: {},
    create: {
      quoteNumber: 'P-0001',
      clientId: client.id,
      jobId: job.id,
      title: 'Presupuesto inicial de ejemplo',
      description: 'Presupuesto demo para validar el modulo comercial.',
      status: 'draft',
      materialsCost: 120000,
      laborCost: 90000,
      paintCost: 25000,
      extraCost: 0,
      subtotal: 235000,
      discount: 0,
      profitMargin: 10,
      total: 258500,
      createdById: adminUser.id,
      items: {
        create: [
          { name: 'Estructura metalica', description: 'Fabricacion de estructura principal.', quantity: 1, unitPrice: 120000, total: 120000, sortOrder: 1 },
          { name: 'Mano de obra', description: 'Fabricacion, soldadura y terminacion.', quantity: 1, unitPrice: 90000, total: 90000, sortOrder: 2 },
        ],
      },
    },
  });

  const galleryItems = [
    { title: 'Porton levadizo doble', slug: 'porton-levadizo-doble', description: 'Porton levadizo doble con estructura metalica y terminacion prolija.', category: 'Portones', mainImageUrl: '/assets/projects/PortonDoble.jpeg', isFeatured: true, sortOrder: 1 },
    { title: 'Porton levadizo estandar', slug: 'porton-levadizo-estandar', description: 'Porton levadizo estandar realizado a medida.', category: 'Portones', mainImageUrl: '/assets/projects/PortonEstandar.jpeg', isFeatured: true, sortOrder: 2 },
    { title: 'Cochera galeria', slug: 'cochera-galeria', description: 'Cochera con estructura metalica y chapa trapezoidal.', category: 'Estructuras', mainImageUrl: '/assets/projects/CocheraGaleria.jpeg', isFeatured: true, sortOrder: 3 },
    { title: 'Carteleria metalica', slug: 'carteleria-metalica', description: 'Carteleria en chapa con corte laser e iluminacion LED.', category: 'Carteleria', mainImageUrl: '/assets/projects/Carteleria.jpeg', isFeatured: false, sortOrder: 4 },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.upsert({ where: { slug: item.slug }, update: item, create: item });
  }

  await prisma.notification.create({
    data: { title: 'Sistema inicializado', message: 'CF Metal Pintura PRO fue inicializado correctamente.', type: 'success', entityType: 'system' },
  });

  console.log('Seed completado correctamente. Configura SEED_ADMIN_PASSWORD y SEED_SUPPORT_PASSWORD en entorno real.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
