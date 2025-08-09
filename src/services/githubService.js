// Servicio para interactuar con GitHub API de forma segura
class GitHubService {
  constructor() {
    this.token = import.meta.env.VITE_GITHUB_TOKEN;
    this.repo = import.meta.env.VITE_GITHUB_REPO;
    this.baseUrl = 'https://api.github.com';
    
    if (!this.token || !this.repo) {
      console.error('⚠️ GitHub token o repo no configurados correctamente');
    }
  }

  // Headers base para todas las peticiones
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  // Subir imagen al repositorio (ahora optimizada)
  async uploadImage(file, fileName, folder = 'public') {
    try {
      // Convertir archivo a base64
      const base64Data = await this.fileToBase64(file);
      
      const path = `${folder}/${fileName}`;
      const url = `${this.baseUrl}/repos/${this.repo}/contents/${path}`;

      // Verificar si el archivo ya existe
      let sha = null;
      try {
        const existingFile = await fetch(url, {
          headers: this.getHeaders()
        });
        
        if (existingFile.ok) {
          const data = await existingFile.json();
          sha = data.sha; // Necesario para sobrescribir
        }
      } catch (e) {
        // Archivo no existe, continuamos sin SHA
      }

      const payload = {
        message: `📸 Agregar imagen optimizada: ${fileName} (WebP)`,
        content: base64Data,
        ...(sha && { sha }) // Solo incluir SHA si existe
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error GitHub: ${error.message}`);
      }

      const result = await response.json();
      return {
        success: true,
        downloadUrl: result.content.download_url,
        path: path,
        message: '✅ Imagen optimizada subida correctamente',
        githubUrl: result.content.html_url
      };

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return {
        success: false,
        error: error.message,
        message: '❌ Error subiendo imagen optimizada'
      };
    }
  }

  // Actualizar archivo productos.js
  async updateProductsFile(productos) {
    try {
      const path = 'src/productos.js';
      const url = `${this.baseUrl}/repos/${this.repo}/contents/${path}`;

      // Obtener SHA actual del archivo
      const currentFile = await fetch(url, {
        headers: this.getHeaders()
      });

      if (!currentFile.ok) {
        throw new Error('No se pudo obtener el archivo actual');
      }

      const currentData = await currentFile.json();
      const sha = currentData.sha;

      // Generar nuevo contenido del archivo
      const newContent = this.generateProductsFileContent(productos);
      const base64Content = btoa(unescape(encodeURIComponent(newContent)));

      const payload = {
        message: '🛍️ Actualizar productos desde panel admin',
        content: base64Content,
        sha: sha
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error GitHub: ${error.message}`);
      }

      return {
        success: true,
        message: '✅ Productos actualizados correctamente'
      };

    } catch (error) {
      console.error('Error actualizando productos:', error);
      return {
        success: false,
        error: error.message,
        message: '❌ Error actualizando productos'
      };
    }
  }

  // Actualizar cualquier propiedad de un producto específico por ID
  async updateProductPropertyInFile({ productId, field, oldValue, newValue }) {
    try {
      console.log('🔄 Actualizando producto en productos.js...', { productId, field, oldValue, newValue });
      
      const path = 'src/productos.js';
      const url = `${this.baseUrl}/repos/${this.repo}/contents/${path}`;

      // Obtener archivo actual
      const currentFile = await fetch(url, {
        headers: this.getHeaders()
      });

      if (!currentFile.ok) {
        throw new Error('No se pudo obtener el archivo productos.js');
      }

      const currentData = await currentFile.json();
      const sha = currentData.sha;
      
      // Decodificar contenido actual
      const currentContent = atob(currentData.content);
      
      // Crear patrón de búsqueda más robusto que encuentre el producto por ID y la propiedad específica
      // Manejar tanto valores string como números
      const escapedOldValue = oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      let productPattern;
      if (field === 'id' || field === 'precio' || !isNaN(oldValue)) {
        // Para campos numéricos (sin comillas)
        productPattern = new RegExp(
          `(\\{[\\s\\S]*?"id":\\s*${productId}[\\s\\S]*?"${field}":\\s*)(${escapedOldValue})([\\s\\S]*?\\})`
        );
      } else {
        // Para campos string (con comillas)
        productPattern = new RegExp(
          `(\\{[\\s\\S]*?"id":\\s*${productId}[\\s\\S]*?"${field}":\\s*")(${escapedOldValue})("[\\s\\S]*?\\})`
        );
      }
      
      console.log('🔍 Buscando producto ID:', productId);
      console.log('🔍 Campo a cambiar:', field);
      console.log('🔍 Valor anterior:', oldValue);
      console.log('🔍 Valor nuevo:', newValue);
      
      // Verificar si encontramos el producto
      if (!productPattern.test(currentContent)) {
        console.error('❌ No se encontró el producto:', { productId, field, oldValue });
        throw new Error(`No se encontró el producto ID ${productId} con ${field}: "${oldValue}"`);
      }
      
      // Reemplazar el valor de la propiedad
      let newContent;
      if (field === 'id' || field === 'precio' || !isNaN(oldValue)) {
        // Para campos numéricos (sin comillas)
        newContent = currentContent.replace(productPattern, `$1${newValue}$3`);
      } else {
        // Para campos string (con comillas)
        newContent = currentContent.replace(productPattern, `$1${newValue}$3`);
      }
      
      console.log('✅ Reemplazo realizado correctamente');
      
      // Codificar nuevo contenido
      const base64Content = btoa(unescape(encodeURIComponent(newContent)));

      const payload = {
        message: `� Actualizar ${field} del producto ${productId}: "${oldValue}" → "${newValue}"`,
        content: base64Content,
        sha: sha
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error GitHub: ${error.message}`);
      }

      return {
        success: true,
        message: `✅ ${field} actualizado: "${newValue}"`
      };

    } catch (error) {
      console.error('❌ Error actualizando producto en productos.js:', error);
      return {
        success: false,
        error: error.message,
        message: `❌ Error: ${error.message}`
      };
    }
  }

  // Actualizar producto completo por ID - MÉTODO CORREGIDO
  async updateCompleteProduct({ productId, newProductData }) {
    try {
      console.log('🔄 Actualizando producto completo por ID...', { productId, newProductData });
      
      const path = 'src/productos.js';
      const url = `${this.baseUrl}/repos/${this.repo}/contents/${path}`;

      // Obtener archivo actual
      const currentFile = await fetch(url, {
        headers: this.getHeaders()
      });

      if (!currentFile.ok) {
        throw new Error('No se pudo obtener el archivo productos.js');
      }

      const currentData = await currentFile.json();
      const sha = currentData.sha;
      
      // Decodificar contenido actual
      const currentContent = atob(currentData.content);
      
      // Buscar el producto completo por ID con un patrón más específico
      // Este patrón busca desde la llave de apertura del objeto hasta su cierre
      const productPattern = new RegExp(
        `(\\s*\\{\\s*"id":\\s*${productId},)[\\s\\S]*?(\\}\\s*,?)(?=\\s*\\{|\\s*\\])`
      );
      
      console.log('🔍 Buscando producto completo ID:', productId);
      
      // Verificar si encontramos el producto
      const match = currentContent.match(productPattern);
      if (!match) {
        console.error('❌ No se encontró el producto ID:', productId);
        throw new Error(`No se encontró el producto ID ${productId}`);
      }
      
      // Construir nuevo objeto producto completo con formato correcto
      const newProductObject = `    {
      "id": ${productId},
      "titulo": "${newProductData.titulo}",
      "descripcion": "${newProductData.descripcion}",
      "precio": "${newProductData.precio}",
      "imagen": "${newProductData.imagen}",
      "alt": "${newProductData.alt}"
    }`;
      
      // Determinar si necesita coma final (no es el último producto)
      const needsComma = match[2].includes(',');
      const finalObject = needsComma ? newProductObject + ',' : newProductObject;
      
      // Reemplazar el producto completo manteniendo el spacing correcto
      const newContent = currentContent.replace(productPattern, `${match[1].substring(0, match[1].indexOf('{'))}${finalObject}`);
      
      console.log('✅ Reemplazo de producto completo realizado');
      
      // Codificar nuevo contenido
      const base64Content = btoa(unescape(encodeURIComponent(newContent)));

      const payload = {
        message: `🔄 Actualizar producto completo ID ${productId}`,
        content: base64Content,
        sha: sha
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error GitHub: ${error.message}`);
      }

      return {
        success: true,
        message: `✅ Producto ID ${productId} actualizado completamente`
      };

    } catch (error) {
      console.error('❌ Error actualizando producto completo:', error);
      return {
        success: false,
        error: error.message,
        message: `❌ Error: ${error.message}`
      };
    }
  }

  // Generar contenido del archivo productos.js
  generateProductsFileContent(productos) {
    const productosString = JSON.stringify(productos, null, 2)
      .replace(/"/g, '"')
      .replace(/\n/g, '\n  ');

    return `
export const productos = ${productosString};`;
  }

  // Convertir archivo a base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remover el prefijo data:image/...;base64,
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Obtener lista de imágenes del repositorio
  async getImages(folder = 'public') {
    try {
      const url = `${this.baseUrl}/repos/${this.repo}/contents/${folder}`;
      const response = await fetch(url, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error obteniendo imágenes');
      }

      const files = await response.json();
      return files.filter(file => 
        file.type === 'file' && 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      );

    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      return [];
    }
  }

  // Eliminar imagen del repositorio
  async deleteImage(fileName, folder = 'public') {
    try {
      const path = `${folder}/${fileName}`;
      const url = `${this.baseUrl}/repos/${this.repo}/contents/${path}`;

      // Obtener SHA del archivo
      const fileInfo = await fetch(url, {
        headers: this.getHeaders()
      });

      if (!fileInfo.ok) {
        throw new Error('Archivo no encontrado');
      }

      const data = await fileInfo.json();
      
      const payload = {
        message: `🗑️ Eliminar imagen: ${fileName}`,
        sha: data.sha
      };

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error GitHub: ${error.message}`);
      }

      return {
        success: true,
        message: '✅ Imagen eliminada correctamente'
      };

    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return {
        success: false,
        error: error.message,
        message: '❌ Error eliminando imagen'
      };
    }
  }
}

export default new GitHubService();
