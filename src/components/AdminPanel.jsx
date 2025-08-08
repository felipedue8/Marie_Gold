import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productos } from '../productos';
import GitHubService from '../services/githubService';
import ImageOptimizationService from '../services/imageOptimization';
import { ImageStats } from './ImageStats';
import { showSuccessToast, showErrorToast, showWarningToast } from './Toast';
import './AdminPanel.css';
import './AdminPanelExtensions.css';

export function AdminPanel() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('productos');
  const [productosState, setProductosState] = useState([...productos]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [githubImages, setGithubImages] = useState([]);
  const [showImageStats, setShowImageStats] = useState(false);
  const [lastOptimizationStats, setLastOptimizationStats] = useState(null);

  // Estados para nuevo producto
  const [newProduct, setNewProduct] = useState({
    id: '',
    titulo: '',
    descripcion: '',
    precio: '',
    imagen: '',
    alt: ''
  });

  // Cargar imágenes de GitHub al iniciar
  useEffect(() => {
    loadGitHubImages();
  }, []);

  const loadGitHubImages = async () => {
    try {
      const images = await GitHubService.getImages();
      setGithubImages(images);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    }
  };

  // Manejar subida de imagen con optimización automática
  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    showWarningToast('🔄 Procesando y optimizando imagen...');

    try {
      // 1. Procesar y optimizar imagen
      const processed = await ImageOptimizationService.processImage(file);
      
      // Mostrar estadísticas de optimización
      console.log('📊 Estadísticas de optimización:', processed.stats);
      
      // Guardar estadísticas para mostrar en modal
      setLastOptimizationStats(processed.stats);
      setShowImageStats(true);
      
      showSuccessToast(`✅ Imagen optimizada: ${processed.stats.optimized.compressionRatio}% reducción`);

      // 2. Subir imagen optimizada a GitHub
      showWarningToast('📤 Subiendo imagen optimizada a GitHub...');
      
      const result = await GitHubService.uploadImage(processed.optimizedFile, processed.fileName);

      if (result.success) {
        showSuccessToast(`🎉 ${result.message} (${processed.stats.optimized.sizeFormatted})`);
        await loadGitHubImages(); // Recargar lista de imágenes
        
        // Mostrar información detallada en consola
        console.table({
          'Archivo Original': {
            Tamaño: processed.stats.original.sizeFormatted,
            Formato: processed.stats.original.format,
            Dimensiones: `${processed.stats.original.width}x${processed.stats.original.height}`
          },
          'Archivo Optimizado': {
            Tamaño: processed.stats.optimized.sizeFormatted,
            Formato: processed.stats.optimized.format,
            Reducción: `${processed.stats.optimized.compressionRatio}%`
          }
        });

        return `/${processed.fileName}`; // Retornar path relativo
      } else {
        showErrorToast(result.message);
        return null;
      }
    } catch (error) {
      console.error('Error en el proceso de imagen:', error);
      showErrorToast(`❌ Error: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar cambios en GitHub
  const saveToGitHub = async () => {
    setIsLoading(true);
    showWarningToast('💾 Guardando cambios...');

    try {
      const result = await GitHubService.updateProductsFile(productosState);
      
      if (result.success) {
        showSuccessToast(result.message);
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      showErrorToast('❌ Error guardando cambios');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en formulario de producto
  const handleProductChange = (field, value) => {
    if (selectedProduct !== null) {
      // Editando producto existente
      const updated = [...productosState];
      updated[selectedProduct] = {
        ...updated[selectedProduct],
        [field]: value
      };
      setProductosState(updated);
    } else {
      // Nuevo producto
      setNewProduct(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Agregar nuevo producto
  const addNewProduct = () => {
    if (!newProduct.titulo || !newProduct.precio) {
      showErrorToast('❌ Título y precio son obligatorios');
      return;
    }

    // Generar ID único
    const newId = Math.max(...productosState.map(p => parseFloat(p.id))) + 0.01;
    
    const productToAdd = {
      ...newProduct,
      id: parseFloat(newId.toFixed(2)),
      precio: newProduct.precio.toString()
    };

    setProductosState(prev => [...prev, productToAdd]);
    setNewProduct({
      id: '',
      titulo: '',
      descripcion: '',
      precio: '',
      imagen: '',
      alt: ''
    });
    
    showSuccessToast('✅ Producto agregado');
  };

  // Eliminar producto
  const deleteProduct = (index) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const updated = productosState.filter((_, i) => i !== index);
      setProductosState(updated);
      setSelectedProduct(null);
      showWarningToast('🗑️ Producto eliminado');
    }
  };

  return (
    <div className="admin-panel">
      <ImageStats 
        stats={lastOptimizationStats}
        show={showImageStats}
        onClose={() => setShowImageStats(false)}
      />
      
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🛠️ Panel Administrativo - Marie Golden</h1>
          <div className="admin-header-actions">
            <button onClick={saveToGitHub} disabled={isLoading} className="save-btn">
              {isLoading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
            </button>
            <button onClick={logout} className="logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="admin-tabs">
        <button 
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
        >
          🛍️ Productos
        </button>
        <button 
          className={activeTab === 'imagenes' ? 'active' : ''}
          onClick={() => setActiveTab('imagenes')}
        >
          🖼️ Imágenes
        </button>
        <button 
          className={activeTab === 'nuevo' ? 'active' : ''}
          onClick={() => setActiveTab('nuevo')}
        >
          ➕ Nuevo Producto
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'productos' && (
          <ProductsTab 
            productos={productosState}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onProductChange={handleProductChange}
            onDeleteProduct={deleteProduct}
            onImageUpload={handleImageUpload}
            githubImages={githubImages}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'imagenes' && (
          <ImagesTab 
            images={githubImages}
            onRefresh={loadGitHubImages}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'nuevo' && (
          <NewProductTab 
            newProduct={newProduct}
            onProductChange={handleProductChange}
            onAddProduct={addNewProduct}
            onImageUpload={handleImageUpload}
            githubImages={githubImages}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

// Componente para tab de productos
function ProductsTab({ productos, selectedProduct, setSelectedProduct, onProductChange, onDeleteProduct, onImageUpload, githubImages, isLoading }) {
  const [imageSelectionMode, setImageSelectionMode] = useState('upload');
  const currentProduct = selectedProduct !== null ? productos[selectedProduct] : null;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePath = await onImageUpload(file);
      if (imagePath) {
        onProductChange('imagen', imagePath);
        onProductChange('alt', `Imagen de ${currentProduct?.titulo || 'producto'}`);
      }
    }
  };

  const handleSelectExistingImage = (imageName) => {
    onProductChange('imagen', `/${imageName}`);
    onProductChange('alt', `Imagen de ${currentProduct?.titulo || 'producto'}`);
  };

  return (
    <div className="products-tab">
      <div className="products-list">
        <h2>📦 Lista de Productos ({productos.length})</h2>
        <div className="products-grid">
          {productos.map((producto, index) => (
            <div 
              key={producto.id} 
              className={`product-card ${selectedProduct === index ? 'selected' : ''}`}
              onClick={() => setSelectedProduct(selectedProduct === index ? null : index)}
            >
              <img src={producto.imagen} alt={producto.alt} />
              <h3>{producto.titulo}</h3>
              <p>${producto.precio}</p>
              <span className="product-id">ID: {producto.id}</span>
            </div>
          ))}
        </div>
      </div>

      {currentProduct && (
        <div className="product-editor">
          <div className="editor-header">
            <h2>✏️ Editando: {currentProduct.titulo}</h2>
            <button 
              onClick={() => onDeleteProduct(selectedProduct)}
              className="delete-btn"
              disabled={isLoading}
            >
              🗑️ Eliminar
            </button>
          </div>

          <form className="product-form">
            <div className="form-group">
              <label>ID del Producto:</label>
              <input 
                type="number" 
                step="0.01"
                value={currentProduct.id}
                onChange={(e) => onProductChange('id', parseFloat(e.target.value))}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Título:</label>
              <input 
                type="text"
                value={currentProduct.titulo}
                onChange={(e) => onProductChange('titulo', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={currentProduct.descripcion}
                onChange={(e) => onProductChange('descripcion', e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Precio:</label>
              <input 
                type="text"
                value={currentProduct.precio}
                onChange={(e) => onProductChange('precio', e.target.value)}
                placeholder="40.000"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Imagen Actual:</label>
              <div className="current-image">
                <img src={currentProduct.imagen} alt={currentProduct.alt} />
                <span>{currentProduct.imagen}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Cambiar Imagen:</label>
              
              {/* Selector de modo */}
              <div className="image-mode-selector">
                <button
                  type="button"
                  className={`mode-toggle-btn ${imageSelectionMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setImageSelectionMode('upload')}
                  disabled={isLoading}
                >
                  📤 Subir Nueva
                </button>
                <button
                  type="button"
                  className={`mode-toggle-btn ${imageSelectionMode === 'select' ? 'active' : ''}`}
                  onClick={() => setImageSelectionMode('select')}
                  disabled={isLoading}
                >
                  📁 Elegir Existente
                </button>
              </div>

              {/* Subir nueva imagen */}
              {imageSelectionMode === 'upload' && (
                <div>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <div className="optimization-note">
                    ⚡ Optimización automática: WebP + compresión inteligente
                  </div>
                </div>
              )}

              {/* Seleccionar imagen existente */}
              {imageSelectionMode === 'select' && (
                <div className="image-select-container">
                  <select 
                    value={currentProduct.imagen.replace('/', '') || ''} 
                    onChange={(e) => handleSelectExistingImage(e.target.value)}
                    className="image-select-dropdown"
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar imagen...</option>
                    {githubImages.map((image) => (
                      <option key={image.sha} value={image.name}>
                        {image.name.replace(/\.[^/.]+$/, "")} ({Math.round(image.size / 1024)}KB)
                      </option>
                    ))}
                  </select>
                  
                  {currentProduct.imagen && (
                    <div className="compact-image-preview">
                      <img 
                        src={githubImages.find(img => `/${img.name}` === currentProduct.imagen)?.download_url || currentProduct.imagen} 
                        alt="Preview" 
                      />
                      <span className="image-name">{currentProduct.imagen.replace('/', '')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Texto Alternativo:</label>
              <input 
                type="text"
                value={currentProduct.alt}
                onChange={(e) => onProductChange('alt', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Componente para tab de imágenes
function ImagesTab({ images, onRefresh, isLoading }) {
  const [deletingImage, setDeletingImage] = useState(null);

  const handleDeleteImage = async (imageName) => {
    if (!confirm(`¿Estás seguro de eliminar "${imageName}"?`)) {
      return;
    }

    setDeletingImage(imageName);
    showWarningToast('🗑️ Eliminando imagen...');

    try {
      const result = await GitHubService.deleteImage(imageName);
      
      if (result.success) {
        showSuccessToast(result.message);
        await onRefresh(); // Recargar lista de imágenes
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      showErrorToast('❌ Error eliminando imagen');
    } finally {
      setDeletingImage(null);
    }
  };

  return (
    <div className="images-tab">
      <div className="images-header">
        <h2>🖼️ Imágenes en el Repositorio ({images.length})</h2>
        <button onClick={onRefresh} disabled={isLoading}>
          {isLoading ? '⏳ Cargando...' : '🔄 Actualizar'}
        </button>
      </div>

      <div className="images-grid">
        {images.map((image) => (
          <div key={image.sha} className="image-card">
            <div className="image-preview">
              <img src={image.download_url} alt={image.name} />
              <div className="image-overlay">
                <button 
                  onClick={() => navigator.clipboard.writeText(`/${image.name}`)}
                  className="image-action-btn copy-btn"
                  title="Copiar ruta"
                >
                  📋
                </button>
                <button 
                  onClick={() => handleDeleteImage(image.name)}
                  className="image-action-btn delete-btn"
                  disabled={deletingImage === image.name || isLoading}
                  title="Eliminar imagen"
                >
                  {deletingImage === image.name ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
            <div className="image-info">
              <h4>{image.name}</h4>
              <p>Tamaño: {Math.round(image.size / 1024)} KB</p>
              <div className="image-actions">
                <button 
                  onClick={() => navigator.clipboard.writeText(`/${image.name}`)}
                  className="copy-path-btn"
                  disabled={isLoading}
                >
                  📋 Copiar Ruta
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {images.length === 0 && !isLoading && (
        <div className="no-images">
          <p>📷 No hay imágenes en el repositorio</p>
          <p>Sube una imagen desde la pestaña de productos</p>
        </div>
      )}
    </div>
  );
}

// Componente para tab de nuevo producto
function NewProductTab({ newProduct, onProductChange, onAddProduct, onImageUpload, isLoading, githubImages }) {
  const [imageSelectionMode, setImageSelectionMode] = useState('upload'); // 'upload' o 'select'

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePath = await onImageUpload(file);
      if (imagePath) {
        onProductChange('imagen', imagePath);
        onProductChange('alt', `Imagen de ${newProduct.titulo || 'producto'}`);
      }
    }
  };

  const handleSelectExistingImage = (imageName) => {
    onProductChange('imagen', `/${imageName}`);
    onProductChange('alt', `Imagen de ${newProduct.titulo || 'producto'}`);
    showSuccessToast(`✅ Imagen seleccionada: ${imageName}`);
  };

  return (
    <div className="new-product-tab">
      <h2>➕ Crear Nuevo Producto</h2>
      
      <form className="product-form" onSubmit={(e) => { e.preventDefault(); onAddProduct(); }}>
        <div className="form-group">
          <label>Título: *</label>
          <input 
            type="text"
            value={newProduct.titulo}
            onChange={(e) => onProductChange('titulo', e.target.value)}
            placeholder="Nombre del producto"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={newProduct.descripcion}
            onChange={(e) => onProductChange('descripcion', e.target.value)}
            placeholder="Descripción del producto"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Precio: *</label>
          <input 
            type="text"
            value={newProduct.precio}
            onChange={(e) => onProductChange('precio', e.target.value)}
            placeholder="40.000"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Imagen:</label>
          
          {/* Selector de modo de imagen */}
          <div className="image-mode-selector">
            <button
              type="button"
              className={`mode-toggle-btn ${imageSelectionMode === 'upload' ? 'active' : ''}`}
              onClick={() => setImageSelectionMode('upload')}
              disabled={isLoading}
            >
              📤 Subir Nueva
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${imageSelectionMode === 'select' ? 'active' : ''}`}
              onClick={() => setImageSelectionMode('select')}
              disabled={isLoading}
            >
              📁 Elegir Existente
            </button>
          </div>

          {/* Subir nueva imagen */}
          {imageSelectionMode === 'upload' && (
            <div className="upload-section">
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              <div className="optimization-note">
                ⚡ Optimización automática: WebP + compresión inteligente para máximo rendimiento
              </div>
            </div>
          )}

          {/* Seleccionar imagen existente */}
          {imageSelectionMode === 'select' && (
            <div className="image-selector">
              <div className="available-images">
                <h4>🖼️ Imágenes Disponibles ({githubImages.length})</h4>
                {githubImages.length === 0 ? (
                  <p className="no-images-message">
                    📷 No hay imágenes disponibles. Sube una imagen primero.
                  </p>
                ) : (
                  <div className="image-select-container">
                    <select 
                      value={newProduct.imagen.replace('/', '') || ''} 
                      onChange={(e) => handleSelectExistingImage(e.target.value)}
                      className="image-select-dropdown"
                    >
                      <option value="">Seleccionar imagen...</option>
                      {githubImages.map((image) => (
                        <option key={image.sha} value={image.name}>
                          {image.name.replace(/\.[^/.]+$/, "")} ({Math.round(image.size / 1024)}KB)
                        </option>
                      ))}
                    </select>
                    
                    {newProduct.imagen && (
                      <div className="compact-image-preview">
                        <img 
                          src={githubImages.find(img => `/${img.name}` === newProduct.imagen)?.download_url} 
                          alt="Preview" 
                        />
                        <span className="image-name">{newProduct.imagen.replace('/', '')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview de imagen seleccionada */}
          {newProduct.imagen && (
            <div className="image-preview">
              <img src={newProduct.imagen} alt="Preview" />
              <div className="preview-info">
                <span>✅ Imagen seleccionada</span>
                <button 
                  type="button" 
                  onClick={() => onProductChange('imagen', '')}
                  className="remove-image-btn"
                  disabled={isLoading}
                >
                  ❌ Quitar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Texto Alternativo:</label>
          <input 
            type="text"
            value={newProduct.alt}
            onChange={(e) => onProductChange('alt', e.target.value)}
            placeholder="Descripción de la imagen"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="add-product-btn" disabled={isLoading || !newProduct.titulo || !newProduct.precio}>
          {isLoading ? '⏳ Creando...' : '➕ Crear Producto'}
        </button>
      </form>
    </div>
  );
}
