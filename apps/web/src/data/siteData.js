import { Hammer, PaintRoller, PanelsTopLeft, Zap, ShieldCheck, Ruler, Truck, Sparkles } from 'lucide-react';
import { projectImages } from './projectImages.js';

export const businessInfo = {
  name: 'CF Metal-Pintura',
  headline: 'Soluciones integrales para tu obra',
  description:
    'Especialistas en metalúrgica, pintura, durlock y electricidad. Trabajos a medida, terminaciones prolijas y atención directa en Las Higueras y Río Cuarto.',
  phone: '(0358) 155719450',
  whatsapp: import.meta.env.VITE_PUBLIC_WHATSAPP_PHONE || '5493585719450',
  email: 'cesarromanisio6@gmail.com',
  location: 'Las Higueras, Río Cuarto, Córdoba, Argentina',
  instagram: import.meta.env.VITE_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/cesarromanisio/',
  facebook: import.meta.env.VITE_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/CesarRomanisioHig',
};

export const services = [
  {
    title: 'Metalúrgica',
    slug: 'metalurgica',
    icon: Hammer,
    description:
      'Fabricación, soldadura y mantenimiento de estructuras metálicas, portones, rejas, cerramientos y soluciones a medida.',
  },
  {
    title: 'Pintura',
    slug: 'pintura',
    icon: PaintRoller,
    description:
      'Aplicación profesional de pintura en interiores, exteriores y estructuras, con terminaciones duraderas y prolijas.',
  },
  {
    title: 'Durlock',
    slug: 'durlock',
    icon: PanelsTopLeft,
    description:
      'Instalación de tabiques, cielorrasos y revestimientos en seco, adaptados al diseño y funcionalidad de cada espacio.',
  },
  {
    title: 'Electricidad',
    slug: 'electricidad',
    icon: Zap,
    description:
      'Montaje, reparación y adecuación de instalaciones eléctricas para obras, viviendas y espacios comerciales.',
  },
];

export const processSteps = [
  { title: 'Consulta', description: 'Escuchamos tu necesidad y revisamos el tipo de trabajo.' },
  { title: 'Medición', description: 'Coordinamos visita, medidas y detalles técnicos.' },
  { title: 'Presupuesto', description: 'Armamos una propuesta clara con materiales, mano de obra y tiempos.' },
  { title: 'Producción', description: 'Fabricamos, pintamos o instalamos cuidando cada terminación.' },
  { title: 'Entrega', description: 'Coordinamos la entrega o instalación final del trabajo.' },
];

export const featuredWorks = [
  {
    title: 'Portón levadizo doble',
    category: 'Portones',
    image: projectImages.portonDoble,
    description: 'Portón levadizo doble con estructura metálica y terminación prolija.',
  },
  {
    title: 'Portón levadizo estándar',
    category: 'Portones',
    image: projectImages.portonEstandar,
    description: 'Portón a medida con revestimiento y sistema levadizo.',
  },
  {
    title: 'Cochera galería',
    category: 'Estructuras',
    image: projectImages.cocheraGaleria,
    description: 'Estructura metálica amplia con chapa trapezoidal.',
  },
  {
    title: 'Cartelería metálica',
    category: 'Cartelería',
    image: projectImages.carteleria,
    description: 'Cartelería en chapa con corte láser e iluminación LED.',
  },
];

export const benefits = [
  { title: 'Trabajo a medida', icon: Ruler, description: 'Cada solución se adapta al espacio, uso y presupuesto del cliente.' },
  { title: 'Calidad y seguridad', icon: ShieldCheck, description: 'Priorizamos estructuras firmes, materiales adecuados y terminaciones resistentes.' },
  { title: 'Entrega responsable', icon: Truck, description: 'Organizamos tiempos de producción, instalación y seguimiento del trabajo.' },
  { title: 'Terminación profesional', icon: Sparkles, description: 'Cuidamos la estética final para que el resultado sea funcional y prolijo.' },
];

export const testimonials = [
  {
    name: 'Cliente particular',
    text: 'Trabajo prolijo, buena atención y el portón quedó tal como lo necesitábamos.',
  },
  {
    name: 'Obra residencial',
    text: 'Cumplieron con la fabricación, pintura e instalación. Muy recomendable.',
  },
  {
    name: 'Comercio local',
    text: 'Nos ayudaron con una estructura metálica a medida y cartelería con buena terminación.',
  },
];
