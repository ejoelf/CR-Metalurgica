import { useEffect } from 'react';
import FoundryHome from './FoundryHome.jsx';
import { updateSeo } from '../utils/seo.js';

export default function HomePage() {
  useEffect(() => {
    updateSeo({
      title: 'CF Metal Pintura | Metalúrgica, pintura y obra a medida',
      description: 'Trabajos en metal, pintura, durlock y electricidad para viviendas, comercios y obras en Las Higueras y Río Cuarto.',
    });
  }, []);

  return <FoundryHome />;
}
