import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../../data/products.json';

// Fallbacks de alta definición para calzado en caso de que assets no carguen
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=700'
];

/**
 * Parsea cadenas de precio monetario como "S/ 350.00" a valor numérico puro.
 */
const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const match = String(priceStr).replace(/[^\d.]/g, '');
  return parseFloat(match) || 0;
};

/**
 * Componente ProductGrid con Paginación Estricta (30 items por página) y Filtros Dinámicos.
 * El catálogo presenta botones "Ver más" que dirigen al usuario a la vista de detalle PDP.
 */
export const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(600);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 30;

  const categories = ['Todas', 'Running', 'Casuales', 'Edición Limitada', 'Urbanas'];
  const sizes = ['38', '39', '40', '41', '42', '43'];

  // Filtrado de productos antes de la paginación
  const filteredProducts = productsData.filter((product) => {
    const matchCategory =
      selectedCategory === 'Todas' ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      product.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      product.description.toLowerCase().includes(selectedCategory.toLowerCase());

    const numericPrice = parsePrice(product.price);
    const matchPrice = numericPrice <= maxPrice;

    return matchCategory && matchPrice;
  });

  // Cálculo estricto de paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    Math.min(indexOfLastProduct, filteredProducts.length)
  );

  // Manejadores con reset de paginación
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (price) => {
    setMaxPrice(price);
    setCurrentPage(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize((prev) => (prev === size ? 'Todas' : size));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const catalogEl = document.getElementById('productos');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('Todas');
    setSelectedSize('Todas');
    setMaxPrice(600);
    setCurrentPage(1);
  };

  const handleImageError = (event, index) => {
    event.currentTarget.onerror = null;
    const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    event.currentTarget.src = fallback;
  };

  return (
    <section
      id="productos"
      className="py-12 lg:py-16 bg-gray-50/50"
      aria-label="Catálogo de productos de calzado"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera del Catálogo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <span className="text-emerald-600 text-xs sm:text-sm font-bold tracking-wider uppercase">
              Catálogo Oficial
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Colección de Calzado Urbano
            </h1>
          </div>
          <p className="mt-2 md:mt-0 text-sm text-gray-500 font-medium">
            {filteredProducts.length > 0
              ? `Mostrando ${indexOfFirstProduct + 1} - ${Math.min(indexOfLastProduct, filteredProducts.length)} de ${filteredProducts.length} modelos disponibles`
              : 'No se encontraron modelos con los filtros seleccionados'}
          </p>
        </div>

        {/* Layout Asimétrico: Sidebar (1 Columna) + Catálogo (3 Columnas) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          
          {/* Columna Izquierda: Sidebar de Filtros UI */}
          <aside className="lg:col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-7">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Filtros</h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold focus-visible:outline-none focus-visible:underline cursor-pointer"
              >
                Limpiar
              </button>
            </div>

            {/* Filtro 1: Categorías */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Categorías
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer select-none group"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                    />
                    <span className={`transition-colors ${selectedCategory === cat ? 'font-semibold text-gray-900' : 'group-hover:text-gray-900'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro 2: Tallas en Píldoras Interactivas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tallas Disponibles
                </h3>
                {selectedSize !== 'Todas' && (
                  <span className="text-[11px] text-emerald-600 font-semibold">EU {selectedSize}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    className={`min-h-[40px] rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    EU {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro 3: Rango de Precio con Slider Visual */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Precio Máximo
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  S/ {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="600"
                step="10"
                value={maxPrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>S/ 200</span>
                <span>S/ 600</span>
              </div>
            </div>

            {/* Micro Banner de Asesoría en Sidebar */}
            <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-100/70 text-xs text-emerald-800">
              <p className="font-semibold flex items-center gap-1.5">
                <span>💬</span> ¿Dudas con tu talla?
              </p>
              <p className="text-emerald-700 mt-1">
                Escríbenos directamente a WhatsApp y te asesoramos al instante.
              </p>
            </div>
          </aside>

          {/* Columna Derecha: Catálogo de Zapatillas con Botón 'Ver más' */}
          <main className="lg:col-span-3 flex flex-col">
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product, index) => {
                  const globalIndex = indexOfFirstProduct + index;

                  return (
                    <article
                      key={product.id || globalIndex}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                      {/* Enlace al Detalle del Producto (PDP) en la Imagen */}
                      <Link
                        to={`/producto/${product.id}`}
                        className="block overflow-hidden relative aspect-square bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        aria-label={`Ver detalles de ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => handleImageError(e, globalIndex)}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />

                        {/* Badge de Precio Estilo Glassmorphism */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/60">
                          <span className="text-sm font-extrabold text-gray-900">
                            {product.price}
                          </span>
                        </div>

                        {/* Tag de Colección */}
                        <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide">
                          {product.category || 'Original'}
                        </div>
                      </Link>

                      {/* Información y Acción Ver Más */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Enlace al Detalle del Producto (PDP) en el Título */}
                          <Link
                            to={`/producto/${product.id}`}
                            className="block group/title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                          >
                            <h3 className="text-lg font-bold text-gray-900 group-hover/title:text-emerald-700 transition-colors leading-snug">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Botón Ver Más */}
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <Link
                            to={`/producto/${product.id}`}
                            className="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-medium text-sm shadow-sm hover:shadow transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
                            aria-label={`Ver más detalles de ${product.name}`}
                          >
                            <span>Ver más</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Estado Vacío cuando no coinciden filtros */
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <span className="text-4xl">👟</span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  No se encontraron zapatillas
                </h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  Prueba cambiando los filtros seleccionados o restablece los valores predeterminados.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}

            {/* Controles de Paginación UI Premium (Estilo iOS Píldora) */}
            {totalPages > 1 && (
              <nav
                className="mt-12 pt-8 border-t border-gray-200/80 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
                aria-label="Paginación del catálogo"
              >
                {/* Botón Anterior */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200 active:scale-95'
                  }`}
                  aria-label="Ir a página anterior"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Anterior</span>
                </button>

                {/* Botones Numéricos de Página */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`min-h-[42px] min-w-[42px] px-3.5 rounded-xl text-sm font-bold transition-all ${
                        currentPage === pageNumber
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
                      }`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                      aria-label={`Página ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Botón Siguiente */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200 active:scale-95'
                  }`}
                  aria-label="Ir a página siguiente"
                >
                  <span>Siguiente</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            )}

          </main>

        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
