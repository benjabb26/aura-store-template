import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig.js';
import { generateWhatsAppLink } from '../../utils/whatsapp.js';

/**
 * Ícono vectorial SVG oficial de WhatsApp con accesibilidad.
 */
const WhatsAppIcon = () => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Componente Navbar responsive optimizado para smartphones (320px-390px) y pantallas retina.
 */
export const Navbar = ({
  businessName,
  whatsappLink
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const brandName = businessName || siteConfig?.businessName || 'Aura Store';
  const waUrl = whatsappLink || generateWhatsAppLink(siteConfig?.whatsappNumber, siteConfig?.whatsappDefaultMessage);

  // Escucha del hash para navegación fluida por anclas en cualquier ruta
  useEffect(() => {
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        const timer = setTimeout(() => {
          const el = document.querySelector(location.hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Cierre con Escape y al redimensionar a desktop
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm supports-[backdrop-filter]:bg-white/65 transition-all duration-300">
      <nav
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2"
        aria-label="Navegación principal"
      >
        {/* Izquierda: Identidad de Marca / Logo (Truncado seguro en 320px) */}
        <div className="flex-shrink-0 min-w-0">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-1.5 group text-gray-900 font-bold text-base sm:text-xl tracking-tight hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-lg py-1 px-1 -ml-1"
            aria-label={`${brandName} - Inicio`}
          >
            <span className="truncate max-w-[130px] sm:max-w-none">{brandName}</span>
          </Link>
        </div>

        {/* Centro: Enlaces de Navegación en Escritorio (React Router + Anclas) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3.5 py-1.5 rounded-full hover:bg-gray-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            Inicio
          </Link>

          <Link
            to="/#nosotros"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3.5 py-1.5 rounded-full hover:bg-gray-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            Nosotros
          </Link>

          {/* Enlace Productos con Menú Desplegable Flotante y Hover Bridge */}
          <div className="relative group">
            <Link
              to="/productos"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3.5 py-1.5 rounded-full hover:bg-gray-100/60 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              <span>Productos</span>
              <svg
                className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-hover:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Contenedor Flotante con Hover Bridge */}
            <div className="absolute top-full left-0 pt-2.5 hidden group-hover:block z-50 transition-all duration-200">
              <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl rounded-2xl p-2 min-w-[210px] animate-fadeIn">
                <Link
                  to="/productos"
                  className="px-3.5 py-2 text-xs font-semibold text-gray-800 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>Ver Catálogo Completo</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">Todo</span>
                </Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <Link
                  to="/productos"
                  className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Running
                </Link>
                <Link
                  to="/productos"
                  className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Casuales
                </Link>
                <Link
                  to="/productos"
                  className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Edición Limitada
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha: Botón de WhatsApp Compacto + Toggle Dropdown Móvil con touch-manipulation */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-4 py-2 sm:py-2.5 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 touch-manipulation"
            aria-label={`Contactar a ${brandName} por WhatsApp`}
          >
            <WhatsAppIcon />
            <span className="inline md:hidden">Contactar</span>
            <span className="hidden md:inline">Comprar por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-dropdown"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 touch-manipulation"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menú Desplegable Móvil con scroll vertical seguro en pantallas pequeñas */}
      <div
        id="mobile-nav-dropdown"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200/40 bg-white/95 backdrop-blur-2xl shadow-xl supports-[backdrop-filter]:bg-white/90 ${
          isOpen
            ? 'max-h-[85vh] opacity-100 py-3 px-4 sm:px-6 overflow-y-auto'
            : 'max-h-0 opacity-0 py-0 px-4 sm:px-6 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1 pb-4">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-base font-medium text-gray-800 hover:text-gray-950 hover:bg-gray-100/70 active:bg-gray-200/50 transition-colors touch-manipulation"
          >
            <span>Inicio</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/#nosotros"
            onClick={handleLinkClick}
            className="min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-base font-medium text-gray-800 hover:text-gray-950 hover:bg-gray-100/70 active:bg-gray-200/50 transition-colors touch-manipulation"
          >
            <span>Nosotros</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/productos"
            onClick={handleLinkClick}
            className="min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-base font-medium text-gray-800 hover:text-gray-950 hover:bg-gray-100/70 active:bg-gray-200/50 transition-colors touch-manipulation"
          >
            <span>Productos</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
