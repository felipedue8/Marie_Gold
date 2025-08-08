import imageCompression from 'browser-image-compression';

class ImageOptimizationService {
  constructor() {
    // Configuración por defecto para la compresión
    this.defaultOptions = {
      maxSizeMB: 0.5,          // Tamaño máximo 500KB
      maxWidthOrHeight: 800,   // Máximo 800px de ancho o alto
      useWebWorker: true,      // Usar Web Workers para mejor rendimiento
      fileType: 'image/webp',  // Convertir a WebP
      initialQuality: 0.8      // Calidad inicial 80%
    };

    // Configuración para thumbnails
    this.thumbnailOptions = {
      maxSizeMB: 0.1,          // 100KB para thumbnails
      maxWidthOrHeight: 300,   // 300px máximo
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.7
    };
  }

  /**
   * Optimizar imagen principal para productos
   * @param {File} file - Archivo de imagen original
   * @returns {Promise<{optimizedFile: File, originalSize: number, compressedSize: number, compressionRatio: number}>}
   */
  async optimizeProductImage(file) {
    try {
      console.log('🔄 Iniciando optimización de imagen...');
      const originalSize = file.size;

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Comprimir y convertir a WebP
      const optimizedFile = await imageCompression(file, this.defaultOptions);
      
      const compressedSize = optimizedFile.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

      console.log(`✅ Imagen optimizada:
        📏 Tamaño original: ${this.formatFileSize(originalSize)}
        📏 Tamaño optimizado: ${this.formatFileSize(compressedSize)}
        📊 Reducción: ${compressionRatio}%
        🖼️ Formato: WebP`);

      return {
        optimizedFile,
        originalSize,
        compressedSize,
        compressionRatio: parseFloat(compressionRatio),
        format: 'webp'
      };

    } catch (error) {
      console.error('❌ Error optimizando imagen:', error);
      throw new Error(`Error en optimización: ${error.message}`);
    }
  }

  /**
   * Crear thumbnail de una imagen
   * @param {File} file - Archivo de imagen original
   * @returns {Promise<File>}
   */
  async createThumbnail(file) {
    try {
      console.log('🖼️ Creando thumbnail...');
      
      const thumbnail = await imageCompression(file, this.thumbnailOptions);
      
      console.log(`✅ Thumbnail creado: ${this.formatFileSize(thumbnail.size)}`);
      return thumbnail;

    } catch (error) {
      console.error('❌ Error creando thumbnail:', error);
      throw error;
    }
  }

  /**
   * Validar imagen antes de procesar
   * @param {File} file - Archivo a validar
   * @returns {{valid: boolean, error?: string}}
   */
  validateImage(file) {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato no soportado. Use JPG, PNG, GIF o WebP'
      };
    }

    // Validar tamaño máximo (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'La imagen es muy grande. Máximo 10MB permitido'
      };
    }

    // Validar tamaño mínimo (1KB)
    if (file.size < 1024) {
      return {
        valid: false,
        error: 'La imagen es muy pequeña. Mínimo 1KB requerido'
      };
    }

    return { valid: true };
  }

  /**
   * Obtener información detallada de una imagen
   * @param {File} file - Archivo de imagen
   * @returns {Promise<{width: number, height: number, aspectRatio: number, fileSize: string}>}
   */
  async getImageInfo(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
          fileSize: this.formatFileSize(file.size),
          format: file.type.split('/')[1].toUpperCase()
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('No se pudo cargar la imagen'));
      };

      img.src = url;
    });
  }

  /**
   * Generar nombre único para archivo optimizado
   * @param {string} originalName - Nombre original del archivo
   * @returns {string}
   */
  generateOptimizedFileName(originalName) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    
    // Remover extensión original y agregar .webp
    const nameWithoutExt = originalName.split('.')[0];
    const cleanName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 20);

    return `${cleanName}_${timestamp}_${randomStr}.webp`;
  }

  /**
   * Formatear tamaño de archivo para mostrar
   * @param {number} bytes - Tamaño en bytes
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Procesar imagen completa: validar, optimizar y generar nombre
   * @param {File} file - Archivo original
   * @returns {Promise<{optimizedFile: File, fileName: string, stats: object}>}
   */
  async processImage(file) {
    try {
      // 1. Validar imagen
      const validation = this.validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 2. Obtener información original
      const originalInfo = await this.getImageInfo(file);
      console.log('📊 Información original:', originalInfo);

      // 3. Optimizar imagen
      const optimization = await this.optimizeProductImage(file);

      // 4. Generar nombre único
      const fileName = this.generateOptimizedFileName(file.name);

      // 5. Crear thumbnail (opcional)
      let thumbnail = null;
      try {
        thumbnail = await this.createThumbnail(file);
      } catch (e) {
        console.warn('⚠️ No se pudo crear thumbnail:', e.message);
      }

      return {
        optimizedFile: optimization.optimizedFile,
        fileName,
        stats: {
          original: {
            size: optimization.originalSize,
            sizeFormatted: this.formatFileSize(optimization.originalSize),
            ...originalInfo
          },
          optimized: {
            size: optimization.compressedSize,
            sizeFormatted: this.formatFileSize(optimization.compressedSize),
            format: 'WebP',
            compressionRatio: optimization.compressionRatio
          },
          thumbnail: thumbnail ? {
            size: thumbnail.size,
            sizeFormatted: this.formatFileSize(thumbnail.size)
          } : null
        }
      };

    } catch (error) {
      console.error('❌ Error procesando imagen:', error);
      throw error;
    }
  }

  /**
   * Crear preview de imagen optimizada
   * @param {File} optimizedFile - Archivo optimizado
   * @returns {string} - URL del preview
   */
  createPreview(optimizedFile) {
    return URL.createObjectURL(optimizedFile);
  }
}

// Exportar instancia única
export default new ImageOptimizationService();
