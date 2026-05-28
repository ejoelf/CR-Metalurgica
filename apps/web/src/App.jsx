import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import WorksPage from './pages/WorksPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import QuotesPage from './pages/QuotesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/trabajos" element={<WorksPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/presupuestos" element={<QuotesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
