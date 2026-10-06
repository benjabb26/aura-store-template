import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import HeroSection from './components/sections/HeroSection.jsx';
import AboutUs from './components/sections/AboutUs.jsx';
import ProductGrid from './components/sections/ProductGrid.jsx';
import ProductDetail from './components/sections/ProductDetail.jsx';

/**
 * Vista de Inicio (Home) con Portada y sección Nosotros.
 */
const HomePage = () => (
  <>
    <HeroSection />
    <AboutUs />
  </>
);

/**
 * Componente principal ensamblador con arquitectura híbrida (React Router DOM + Scroll por Anclas).
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
        {/* Navbar persistente en todas las rutas */}
        <Navbar />

        {/* Contenido enrutado dinámicamente */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductGrid />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            {/* Fallback para rutas inexistentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer persistente en todas las rutas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
