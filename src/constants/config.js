// Configuración de la aplicación
export const APP_CONFIG = {
  // Información de contacto
  WHATSAPP_NUMBER: '573227878174',
  
  // Social media
  INSTAGRAM_URL: 'https://www.instagram.com/mar.iegolden?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  TIKTOK_URL: 'https://www.tiktok.com/@mariegolden27?is_from_webapp=1&sender_device=pc',
  
  // Paginación
  PRODUCTOS_POR_PAGINA: 10,
  
  // Carrito
  CARRITO_STORAGE_KEY: 'marie-golden-carrito',
  
  // Timeouts
  NOVIA_MESSAGE_TIMEOUT: 30000, // 30 segundos
  
  // Performance
  LAZY_LOADING_THRESHOLD: 0.1,
  LAZY_LOADING_ROOT_MARGIN: '50px',
  
  // Validaciones
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
};

// URLs y rutas
export const ROUTES = {
  HOME: '/',
  MANILLAS: '/manillas',
  ARETES: '/aretes',
  ANILLOS: '/anillos',
  ACCESORIOS: '/accesorios',
  RAMOS: '/ramos',
  CREAR_MANILLA: '/crea',
  PRODUCTO_DETALLE: '/producto/:id',
  
  // Categorías adicionales
  COLLARES: '/collares',
  PELUCHES: '/peluches',
  TOBILLERAS: '/tobilleras',
  PATOS_PERSONALIZADOS: '/patos-personalizados',
  PERROS_GATOS_FLOR: '/perros-gatos-flor',
  ANIME_BANDAS: '/anime-bandas',
  ROSAS_ETERNAS: '/rosas-eternas',
  PINES: '/pines',
  LLAVEROS: '/llaveros',
};

// Mensajes de la aplicación
export const MESSAGES = {
  ERRORS: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu internet',
    NOT_FOUND: 'Elemento no encontrado',
    VALIDATION: 'Los datos ingresados no son válidos',
  },
  SUCCESS: {
    ADDED_TO_CART: 'Producto agregado al carrito',
    REMOVED_FROM_CART: 'Producto eliminado del carrito',
    CART_CLEARED: 'Carrito vaciado',
  },
  INFO: {
    LOADING: 'Cargando...',
    NO_RESULTS: 'No se encontraron resultados',
    EMPTY_CART: 'Tu carrito está vacío',
  }
};

// Configuración de SEO
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Marie Golden - Joyas y Accesorios Únicos Hechos a Mano',
  DEFAULT_DESCRIPTION: 'Descubre joyas y accesorios únicos en Marie Golden. Manillas, collares, aretes, ramos y más. Piezas artesanales de alta calidad que cuentan tu historia.',
  DEFAULT_KEYWORDS: 'joyas, accesorios, manillas, collares, aretes, ramos, peluches, Marie Golden, artesanal, hecho a mano, Colombia',
  SITE_URL: 'https://marie-golden.vercel.app/',
  LOGO_URL: 'https://marie-golden.vercel.app/imgs/logoPrincipal-removebg-preview.png',
};

// Breakpoints para responsive design
export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1200px',
};
