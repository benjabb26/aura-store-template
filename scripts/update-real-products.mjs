import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PRODUCTS_FILE = path.join(rootDir, 'src', 'data', 'products.json');
const OUTPUT_DIR = path.join(rootDir, 'public', 'images');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 15000;
const CONCURRENCY = 5;

// Definición estricta y curada de los 60 productos de calzado real icónico
const REAL_PRODUCTS = [
  {
    id: "prod-001",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    category: "Urbano",
    price: "S/ 469.00",
    image: "/images/zapatilla-1.webp",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El clásico ícono del básquetbol adaptado al asfalto urbano, con amortiguación Air encapsulada, perfil de cuero blanco nítido y suela de pivote circular.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Air Force 1 '07 (S/ 469.00)."
  },
  {
    id: "prod-002",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    category: "Running",
    price: "S/ 649.00",
    image: "/images/zapatilla-2.webp",
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La versión más ligera de Ultraboost con tecnología Light BOOST para un retorno de energía supremo en cada zancada y tejido PRIMEKNIT+ envolvente.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Ultraboost Light (S/ 649.00)."
  },
  {
    id: "prod-003",
    name: "Air Jordan 1 Retro High OG",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 689.00",
    image: "/images/zapatilla-3.webp",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La silueta legendaria que revolucionó la cultura sneaker, confeccionada con piel genuina de primera calidad en corte alto y amortiguación Air-Sole.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 1 Retro High OG (S/ 689.00)."
  },
  {
    id: "prod-004",
    name: "New Balance 550",
    brand: "New Balance",
    category: "Casual",
    price: "S/ 459.00",
    image: "/images/zapatilla-4.webp",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Tributo al calzado de cancha de los años 80 con un perfil depurado, empeine de cuero de primera y acabados retro sumamente versátiles.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 550 (S/ 459.00)."
  },
  {
    id: "prod-005",
    name: "Puma Suede Classic XXI",
    brand: "Puma",
    category: "Urbano",
    price: "S/ 299.00",
    image: "/images/zapatilla-5.webp",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La legendaria zapatilla de ante suave que marcó a generaciones del breakdance y el streetwear internacional con franja Formstrip en contraste.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Suede Classic XXI (S/ 299.00)."
  },
  {
    id: "prod-006",
    name: "Asics Gel-Kayano 30",
    brand: "Asics",
    category: "Running",
    price: "S/ 599.00",
    image: "/images/zapatilla-6.webp",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Máxima estabilidad adaptativa con el sistema 4D GUIDANCE SYSTEM y amortiguación FF BLAST PLUS ECO para pisadas confortables en distancias largas.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics Gel-Kayano 30 (S/ 599.00)."
  },
  {
    id: "prod-007",
    name: "Converse Chuck 70 Vintage Canvas",
    brand: "Converse",
    category: "Casual",
    price: "S/ 289.00",
    image: "/images/zapatilla-7.webp",
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Versión premium del clásico Chuck Taylor con lona reforzada de 12 oz, costuras tradicionales y plantilla acolchada OrthoLite de alto confort.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse Chuck 70 Vintage Canvas (S/ 289.00)."
  },
  {
    id: "prod-008",
    name: "Vans Old Skool Classic",
    brand: "Vans",
    category: "Urbano",
    price: "S/ 269.00",
    image: "/images/zapatilla-8.webp",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El emblemático modelo skate con la inconfundible franja lateral Sidestripe, puntera reforzada y suela waffle de caucho vulcanizado.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Old Skool Classic (S/ 269.00)."
  },
  {
    id: "prod-009",
    name: "Nike Air Max 90",
    brand: "Nike",
    category: "Urbano",
    price: "S/ 499.00",
    image: "/images/zapatilla-9.webp",
    imageUrl: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Diseño icónico de los 90 con amortiguación Max Air visible, revestimientos cosidos duraderos y detalles clásicos de TPU moldeado.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Air Max 90 (S/ 499.00)."
  },
  {
    id: "prod-010",
    name: "Adidas Stan Smith Lux",
    brand: "Adidas",
    category: "Vestir",
    price: "S/ 389.00",
    image: "/images/zapatilla-10.webp",
    imageUrl: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Silueta minimalista y refinada elaborada con cuero ultrasuave, perfecta para atuendos semi formales impecables y elegancia diaria.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Stan Smith Lux (S/ 389.00)."
  },
  {
    id: "prod-011",
    name: "Air Jordan 4 Retro Military Black",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 690.00",
    image: "/images/zapatilla-11.webp",
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Diseño de colección con bloques tonales neutros, paneles de malla transpirable, suela Air visible y alas de soporte en el mediopié.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 4 Retro Military Black (S/ 690.00)."
  },
  {
    id: "prod-012",
    name: "New Balance 9060",
    brand: "New Balance",
    category: "Urbano",
    price: "S/ 589.00",
    image: "/images/zapatilla-12.webp",
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Fusión futurista de la serie clásica 99X con estética y2k exuberante, entresuela esculpida y amortiguación ABZORB SBS.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 9060 (S/ 589.00)."
  },
  {
    id: "prod-013",
    name: "Puma Velocity Nitro 2",
    brand: "Puma",
    category: "Running",
    price: "S/ 429.00",
    image: "/images/zapatilla-13.webp",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Entrenadora todoterreno con espuma NITRO reactiva, ligereza sobresaliente y suela de tracción duradera PUMAGRIP.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Velocity Nitro 2 (S/ 429.00)."
  },
  {
    id: "prod-014",
    name: "Asics Gel-Nimbus 26",
    brand: "Asics",
    category: "Running",
    price: "S/ 629.00",
    image: "/images/zapatilla-14.webp",
    imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Amortiguación tipo nube con tecnología PureGEL, espuma FF BLAST PLUS ECO y cuello de punto suave para rodajes de larga distancia.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics Gel-Nimbus 26 (S/ 629.00)."
  },
  {
    id: "prod-015",
    name: "Converse Run Star Motion",
    brand: "Converse",
    category: "Urbano",
    price: "S/ 399.00",
    image: "/images/zapatilla-15.webp",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Plataforma ondulada vanguardista con entresuela de espuma CX para una pisada liviana y expresión estilística audaz.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse Run Star Motion (S/ 399.00)."
  },
  {
    id: "prod-016",
    name: "Vans Sk8-Hi Pro",
    brand: "Vans",
    category: "Urbano",
    price: "S/ 319.00",
    image: "/images/zapatilla-16.webp",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Caña alta acolchada para máxima protección de tobillo con refuerzos DURACAP resistentes al desgaste diario del skateboarding.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Sk8-Hi Pro (S/ 319.00)."
  },
  {
    id: "prod-017",
    name: "Nike Pegasus 40",
    brand: "Nike",
    category: "Running",
    price: "S/ 479.00",
    image: "/images/zapatilla-17.webp",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El caballo de batalla con soporte neutral, doble unidad Zoom Air en antepié y talón, y ajuste optimizado en el empeine.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Pegasus 40 (S/ 479.00)."
  },
  {
    id: "prod-018",
    name: "Adidas Samba OG",
    brand: "Adidas",
    category: "Casual",
    price: "S/ 379.00",
    image: "/images/zapatilla-18.webp",
    imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Nacida para el fútbol sala y consagrada como el ícono de moda imprescindible con puntera en T de ante y suela de goma caramelo.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Samba OG (S/ 379.00)."
  },
  {
    id: "prod-019",
    name: "Air Jordan 3 Retro White Cement",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 680.00",
    image: "/images/zapatilla-19.webp",
    imageUrl: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El diseño cumbre de Tinker Hatfield con el icónico estampado Elephant Print, cuero blanco granulado y detalles Reimagined.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 3 Retro White Cement (S/ 680.00)."
  },
  {
    id: "prod-020",
    name: "New Balance 2002R",
    brand: "New Balance",
    category: "Casual",
    price: "S/ 529.00",
    image: "/images/zapatilla-20.webp",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Estilo técnico de principios de los 2000 renovado con empeine de malla transpirable, paneles de ante premium y amortiguación N-ergy.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 2002R (S/ 529.00)."
  },
  {
    id: "prod-021",
    name: "Puma Palermo Leather",
    brand: "Puma",
    category: "Casual",
    price: "S/ 329.00",
    image: "/images/zapatilla-21.webp",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Herencia de la cultura de terrazas europeas con puntera en T de ante, etiqueta dorada lateral y suela de goma retro caramelo.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Palermo Leather (S/ 329.00)."
  },
  {
    id: "prod-022",
    name: "Asics GT-2000 12",
    brand: "Asics",
    category: "Deportivo",
    price: "S/ 499.00",
    image: "/images/zapatilla-22.webp",
    imageUrl: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Zapatilla de estabilidad ligera y transiciones suaves diseñada para corredores que buscan protección articular y confort constante.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics GT-2000 12 (S/ 499.00)."
  },
  {
    id: "prod-023",
    name: "Converse Jack Purcell Leather",
    brand: "Converse",
    category: "Vestir",
    price: "S/ 349.00",
    image: "/images/zapatilla-23.webp",
    imageUrl: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Elegancia sutil con la clásica 'sonrisa' azul en la puntera, exterior de cuero blanco impecable y silueta atemporal.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse Jack Purcell Leather (S/ 349.00)."
  },
  {
    id: "prod-024",
    name: "Vans Authentic Core Classics",
    brand: "Vans",
    category: "Casual",
    price: "S/ 220.00",
    image: "/images/zapatilla-24.webp",
    imageUrl: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El origen de la marca californiana, simple y auténtica, con perfil bajo de lona resistente, ojales metálicos y suela waffle.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Authentic Core Classics (S/ 220.00)."
  },
  {
    id: "prod-025",
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    category: "Urbano",
    price: "S/ 479.00",
    image: "/images/zapatilla-25.webp",
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El fenómeno del streetwear universitario con bloques de color vibrantes, cuello acolchado de corte bajo y suela de agarre óptimo.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Dunk Low Retro (S/ 479.00)."
  },
  {
    id: "prod-026",
    name: "Adidas Gazelle Indoor",
    brand: "Adidas",
    category: "Casual",
    price: "S/ 399.00",
    image: "/images/zapatilla-26.webp",
    imageUrl: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Silueta baja con ante premium, suela de caucho translúcida y las tres bandas dentadas en contraste para un look vintage auténtico.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Gazelle Indoor (S/ 399.00)."
  },
  {
    id: "prod-027",
    name: "Air Jordan 11 Retro Concord",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 690.00",
    image: "/images/zapatilla-27.webp",
    imageUrl: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El charol brillante más icónico de la historia del básquetbol con suela traslúcida icy y placa interna de fibra de carbono.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 11 Retro Concord (S/ 690.00)."
  },
  {
    id: "prod-028",
    name: "New Balance 574 Core",
    brand: "New Balance",
    category: "Casual",
    price: "S/ 329.00",
    image: "/images/zapatilla-28.webp",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La zapatilla todoterreno de horma espaciosa, amortiguación ENCAP duradera y exterior de gamuza y malla que nunca pasa de moda.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 574 Core (S/ 329.00)."
  },
  {
    id: "prod-029",
    name: "Puma Deviate Nitro Elite 2",
    brand: "Puma",
    category: "Running",
    price: "S/ 610.00",
    image: "/images/zapatilla-29.webp",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Zapatilla de competición para maratón con placa interna de carbono INNOPLATE y espuma ultraliviana NITRO Elite para máxima propulsión.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Deviate Nitro Elite 2 (S/ 610.00)."
  },
  {
    id: "prod-030",
    name: "Asics Gel-NYC",
    brand: "Asics",
    category: "Urbano",
    price: "S/ 489.00",
    image: "/images/zapatilla-30.webp",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Inspirada en el estilo dinámico de la Gran Manzana, combinando la parte superior GEL-NIMBUS 3 con tecnología GEL-CUMULUS 16.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics Gel-NYC (S/ 489.00)."
  },
  {
    id: "prod-031",
    name: "Converse One Star Pro",
    brand: "Converse",
    category: "Urbano",
    price: "S/ 299.00",
    image: "/images/zapatilla-31.webp",
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Ante resistente con la icónica estrella troquelada, plantilla de espuma CX acolchada y caucho CONS de máxima tracción.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse One Star Pro (S/ 299.00)."
  },
  {
    id: "prod-032",
    name: "Vans Knu Skool Chunky",
    brand: "Vans",
    category: "Urbano",
    price: "S/ 349.00",
    image: "/images/zapatilla-32.webp",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Reedición noventera acolchada con lengüeta abullonada, cordones gruesos y Sidestripe en relieve tridimensional de gran impacto.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Knu Skool Chunky (S/ 349.00)."
  },
  {
    id: "prod-033",
    name: "Nike Invincible 3",
    brand: "Nike",
    category: "Running",
    price: "S/ 659.00",
    image: "/images/zapatilla-33.webp",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Amortiguación ZoomX maximalista para proteger las articulaciones y brindar una pisada elástica ultrasuave en tus entrenamientos diarios.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Invincible 3 (S/ 659.00)."
  },
  {
    id: "prod-034",
    name: "Adidas Superstar Primeblue",
    brand: "Adidas",
    category: "Casual",
    price: "S/ 359.00",
    image: "/images/zapatilla-34.webp",
    imageUrl: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La legendaria puntera de goma 'Shell Toe' combinada con materiales reciclados de alto rendimiento y un confort urbano perdurable.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Superstar Primeblue (S/ 359.00)."
  },
  {
    id: "prod-035",
    name: "Air Jordan 5 Retro Fire Red",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 670.00",
    image: "/images/zapatilla-35.webp",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Inspirada en los cazas de combate de la Segunda Guerra Mundial, con dientes de tiburón en la suela y lengüeta reflectante 3M.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 5 Retro Fire Red (S/ 670.00)."
  },
  {
    id: "prod-036",
    name: "New Balance 1906R",
    brand: "New Balance",
    category: "Deportivo",
    price: "S/ 569.00",
    image: "/images/zapatilla-36.webp",
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Silueta técnica que rinde homenaje a la estética de los corredores de los años 2000 con soporte N-ergy y tecnología Stability Web.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 1906R (S/ 569.00)."
  },
  {
    id: "prod-037",
    name: "Puma Slipstream Heritage",
    brand: "Puma",
    category: "Urbano",
    price: "S/ 369.00",
    image: "/images/zapatilla-37.webp",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Evolución de un clásico del básquetbol de 1987 convertida en una declaración de moda retro vanguardista con paneles de cuero cosido.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Slipstream Heritage (S/ 369.00)."
  },
  {
    id: "prod-038",
    name: "Asics Novablast 4",
    brand: "Asics",
    category: "Running",
    price: "S/ 549.00",
    image: "/images/zapatilla-38.webp",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Efecto trampolín propulsivo gracias a la geometría angular de la suela y la innovadora espuma acolchada FF BLAST PLUS ECO.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics Novablast 4 (S/ 549.00)."
  },
  {
    id: "prod-039",
    name: "Converse Chuck Taylor All Star Move",
    brand: "Converse",
    category: "Casual",
    price: "S/ 319.00",
    image: "/images/zapatilla-39.webp",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Plataforma ultraligera con líneas dinámicas y curvadas que ofrecen altura y presencia sin añadir peso extra al caminar.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse Chuck Taylor All Star Move (S/ 319.00)."
  },
  {
    id: "prod-040",
    name: "Vans Slip-On Checkerboard",
    brand: "Vans",
    category: "Casual",
    price: "S/ 249.00",
    image: "/images/zapatilla-40.webp",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "El estampado a cuadros damero más reconocido del mundo, sin cordones y de calce rápido para un look desenfadado y clásico.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Slip-On Checkerboard (S/ 249.00)."
  },
  {
    id: "prod-041",
    name: "Nike Vomero 5",
    brand: "Nike",
    category: "Deportivo",
    price: "S/ 569.00",
    image: "/images/zapatilla-41.webp",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Diseño en capas con malla transpirable, jaula de soporte de plástico lateral, detalles reflectantes y doble amortiguación Zoom Air.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Vomero 5 (S/ 569.00)."
  },
  {
    id: "prod-042",
    name: "Adidas Forum Low Classic",
    brand: "Adidas",
    category: "Urbano",
    price: "S/ 379.00",
    image: "/images/zapatilla-42.webp",
    imageUrl: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Herencia del básquetbol ochentero con correa autoadherente extraíble en el tobillo y cuero granulado de gran prestancia.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Forum Low Classic (S/ 379.00)."
  },
  {
    id: "prod-043",
    name: "Air Jordan 1 Low Travis Scott Style",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 690.00",
    image: "/images/zapatilla-43.webp",
    imageUrl: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Edición codiciada con tonos tierra oliva y moca, Swoosh invertido característico y materiales de gamuza de lujo absoluto.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 1 Low Travis Scott Style (S/ 690.00)."
  },
  {
    id: "prod-044",
    name: "New Balance Fresh Foam X 1080v13",
    brand: "New Balance",
    category: "Running",
    price: "S/ 629.00",
    image: "/images/zapatilla-44.webp",
    imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La máxima expresión de comodidad para corredores con espuma Fresh Foam X de amortiguación sedosa y transiciones ultrasuaves.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance Fresh Foam X 1080v13 (S/ 629.00)."
  },
  {
    id: "prod-045",
    name: "Puma CA Pro Classic",
    brand: "Puma",
    category: "Vestir",
    price: "S/ 339.00",
    image: "/images/zapatilla-45.webp",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Líneas depuradas inspiradas en la Costa Oeste californiana, elegantes y fáciles de combinar con pantalones de vestir y trajes casuales.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma CA Pro Classic (S/ 339.00)."
  },
  {
    id: "prod-046",
    name: "Asics Gel-1130",
    brand: "Asics",
    category: "Deportivo",
    price: "S/ 419.00",
    image: "/images/zapatilla-46.webp",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Homenaje a la serie GEL-1000 de finales de los 2000 con inserciones GEL amortiguadoras, detalles metálicos y diseño transpirable.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics Gel-1130 (S/ 419.00)."
  },
  {
    id: "prod-047",
    name: "Converse Weapon Ox",
    brand: "Converse",
    category: "Deportivo",
    price: "S/ 389.00",
    image: "/images/zapatilla-47.webp",
    imageUrl: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Regreso de una leyenda del baloncesto profesional adaptada en corte bajo con piel duradera, acolchado en cuello y suela resistente.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse Weapon Ox (S/ 389.00)."
  },
  {
    id: "prod-048",
    name: "Vans Era 59 Leather Accent",
    brand: "Vans",
    category: "Vestir",
    price: "S/ 279.00",
    image: "/images/zapatilla-48.webp",
    imageUrl: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Lona resistente de doble puntada combinada con detalles refinados de piel en el talón, forro interior suave y perfil de corte bajo.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Era 59 Leather Accent (S/ 279.00)."
  },
  {
    id: "prod-049",
    name: "Nike ZoomX Vaporfly Next% 3",
    brand: "Nike",
    category: "Running",
    price: "S/ 690.00",
    image: "/images/zapatilla-49.webp",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La superzapatilla de competición para maratón de élite con placa de carbono Flyplate de longitud completa y espuma ultrarreactiva ZoomX.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike ZoomX Vaporfly Next% 3 (S/ 690.00)."
  },
  {
    id: "prod-050",
    name: "Adidas Spezial Originals",
    brand: "Adidas",
    category: "Vestir",
    price: "S/ 419.00",
    image: "/images/zapatilla-50.webp",
    imageUrl: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Diseño clásico de balonmano en ante aterciopelado con puntera reforzada, tres bandas dentadas y suela de caramelo de alta distinción.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Spezial Originals (S/ 419.00)."
  },
  {
    id: "prod-051",
    name: "Air Jordan 6 Retro Infrared",
    brand: "Jordan",
    category: "Edición Limitada",
    price: "S/ 680.00",
    image: "/images/zapatilla-51.webp",
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La silueta con la que MJ conquistó su primer campeonato en 1991, vestida con el legendario colorway Infrared y lengüeta de doble orificio.",
    customMessage: "Hola, estoy interesado en las zapatillas Air Jordan 6 Retro Infrared (S/ 680.00)."
  },
  {
    id: "prod-052",
    name: "New Balance 327 Vintage",
    brand: "New Balance",
    category: "Casual",
    price: "S/ 389.00",
    image: "/images/zapatilla-52.webp",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Silueta geométrica angular con el logotipo 'N' sobredimensionado y suela de tacos envolvente inspirada en el trail running de los 70.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 327 Vintage (S/ 389.00)."
  },
  {
    id: "prod-053",
    name: "Puma Fast-R Nitro Elite",
    brand: "Puma",
    category: "Deportivo",
    price: "S/ 670.00",
    image: "/images/zapatilla-53.webp",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Diseño de suela partida revolucionaria con placa de fibra de carbono visible PWRPLATE y peso pluma para romper récords personales.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Fast-R Nitro Elite (S/ 670.00)."
  },
  {
    id: "prod-054",
    name: "Asics Metaspeed Sky Paris",
    brand: "Asics",
    category: "Deportivo",
    price: "S/ 690.00",
    image: "/images/zapatilla-54.webp",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Desarrollada para corredores que alargan su zancada para alcanzar el podio con amortiguación FF TURBO PLUS y placa de carbono curvada.",
    customMessage: "Hola, estoy interesado en las zapatillas Asics Metaspeed Sky Paris (S/ 690.00)."
  },
  {
    id: "prod-055",
    name: "Converse Pro Leather Gold Standard",
    brand: "Converse",
    category: "Vestir",
    price: "S/ 369.00",
    image: "/images/zapatilla-55.webp",
    imageUrl: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Cuero suave de corte impecable con el logotipo Star Chevron lateral, detalles dorados y amortiguación SmartFOAM para uso diario.",
    customMessage: "Hola, estoy interesado en las zapatillas Converse Pro Leather Gold Standard (S/ 369.00)."
  },
  {
    id: "prod-056",
    name: "Vans Half Cab 33 DX",
    brand: "Vans",
    category: "Urbano",
    price: "S/ 359.00",
    image: "/images/zapatilla-56.webp",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La legendaria silueta mid-top diseñada por Steve Caballero con parche bordado icónico en el lateral y ante de primera calidad.",
    customMessage: "Hola, estoy interesado en las zapatillas Vans Half Cab 33 DX (S/ 359.00)."
  },
  {
    id: "prod-057",
    name: "Nike Cortez Classic Leather",
    brand: "Nike",
    category: "Casual",
    price: "S/ 349.00",
    image: "/images/zapatilla-57.webp",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La primera obra maestra de Bill Bowerman con entresuela de cuña de espuma EVA, suela con diseño de espiga y cuero suave blanco.",
    customMessage: "Hola, estoy interesado en las zapatillas Nike Cortez Classic Leather (S/ 349.00)."
  },
  {
    id: "prod-058",
    name: "Adidas Adizero Adios Pro 3",
    brand: "Adidas",
    category: "Running",
    price: "S/ 680.00",
    image: "/images/zapatilla-58.webp",
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Varillas de carbono ENERGYRODS 2.0 que reducen la pérdida de energía y doble capa de espuma Lightstrike Pro para ritmos vertiginosos.",
    customMessage: "Hola, estoy interesado en las zapatillas Adidas Adizero Adios Pro 3 (S/ 680.00)."
  },
  {
    id: "prod-059",
    name: "New Balance 990v6 Made in USA",
    brand: "New Balance",
    category: "Edición Limitada",
    price: "S/ 690.00",
    image: "/images/zapatilla-59.webp",
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "La cúspide del calzado artesanal estadounidense con amortiguación FuelCell en la entresuela y materiales de estricta selección manual.",
    customMessage: "Hola, estoy interesado en las zapatillas New Balance 990v6 Made in USA (S/ 690.00)."
  },
  {
    id: "prod-060",
    name: "Puma Army Trainer",
    brand: "Puma",
    category: "Vestir",
    price: "S/ 329.00",
    image: "/images/zapatilla-60.webp",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80&fm=webp",
    description: "Réplica del calzado de entrenamiento militar de los años 70 en cuero blanco con puntera en ante gris y suela de caucho vintage.",
    customMessage: "Hola, estoy interesado en las zapatillas Puma Army Trainer (S/ 329.00)."
  }
];

async function downloadWithRetry(url, targetPath, retries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'image/webp,image/avif,image/jpeg,image/png,image/*;q=0.8'
        },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        throw new Error('Archivo recibido con tamaño 0 bytes');
      }

      await fs.writeFile(targetPath, buffer);
      return {
        bytes: buffer.length,
        contentType: response.headers.get('content-type') || 'unknown'
      };
    } catch (err) {
      lastError = err;
      console.warn(`[Intento ${attempt}/${retries}] Fallo al descargar ${url}: ${err.message}`);
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, attempt * 1000));
      }
    }
  }
  throw new Error(`Fallo tras ${retries} intentos: ${lastError?.message}`);
}

async function run() {
  console.log('=== ACTUALIZACIÓN Y PERSISTENCIA DE PRODUCTOS REALES ===');
  console.log(`Total productos a procesar: ${REAL_PRODUCTS.length}`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Directorio verificado: ${OUTPUT_DIR}`);

  const results = new Array(REAL_PRODUCTS.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < REAL_PRODUCTS.length) {
      const idx = currentIndex++;
      const item = REAL_PRODUCTS[idx];
      const targetFileName = `zapatilla-${idx + 1}.webp`;
      const targetPath = path.join(OUTPUT_DIR, targetFileName);

      console.log(`[${idx + 1}/${REAL_PRODUCTS.length}] Descargando foto para: ${item.brand} ${item.name} -> ${targetFileName}...`);

      try {
        const downloadInfo = await downloadWithRetry(item.imageUrl, targetPath);
        results[idx] = {
          success: true,
          fileName: targetFileName,
          bytes: downloadInfo.bytes,
          contentType: downloadInfo.contentType
        };
        console.log(`  -> OK: ${targetFileName} (${(downloadInfo.bytes / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  -> ERROR en ${item.id}:`, err);
        results[idx] = {
          success: false,
          error: err.message
        };
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const errors = results.filter(r => !r.success);
  if (errors.length > 0) {
    throw new Error(`Fallaron ${errors.length} descargas de imágenes.`);
  }

  // Preparar el array JSON limpio (sin el campo temporal imageUrl)
  const cleanProductsJson = REAL_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    image: p.image,
    description: p.description,
    customMessage: p.customMessage
  }));

  console.log(`\nGuardando datos normalizados en ${PRODUCTS_FILE}...`);
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(cleanProductsJson, null, 2) + '\n', 'utf-8');
  console.log(`Archivo JSON actualizado exitosamente con 2 espacios de indentación.`);

  console.log('\n=== VALIDACIÓN DE INTEGRIDAD ===');
  let totalBytes = 0;
  for (let i = 0; i < 60; i++) {
    const fPath = path.join(OUTPUT_DIR, `zapatilla-${i + 1}.webp`);
    const stat = await fs.stat(fPath);
    if (stat.size === 0) {
      throw new Error(`Archivo vacío detectado: ${fPath}`);
    }
    totalBytes += stat.size;
  }

  console.log(`✓ 60/60 archivos físicos existen en public/images/`);
  console.log(`✓ Tamaño total descargado: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✓ Catálogo estructurado con 60 productos reales (Nike, Adidas, Jordan, New Balance, Puma, Asics, Converse, Vans).`);
  console.log('=== PROCESO COMPLETADO EXITOSAMENTE ===');
}

run().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
