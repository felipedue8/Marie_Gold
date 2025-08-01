
import './cards.css';
import { LazyImage } from "./LazyImage.jsx";
import { Link } from 'react-router-dom';
import { useCarrito } from './CarritoContext';
import { BotonFavorito } from "./components/BotonFavorito";
import { showSuccessToast, showWarningToast } from "./components/Toast";
import { validarProductoCarrito } from './utils/validaciones';

export function tarjetas(title, description, price, srcimg, alt, id) {
  const { agregarProducto, eliminarProducto, carrito } = useCarrito();
  
  // Verificar si el producto ya está en el carrito
  const productoEnCarrito = carrito.find(p => String(p.id) === String(id));
  const yaEnCarrito = !!productoEnCarrito;
  const cantidad = productoEnCarrito?.cantidad || 0;

  const handleToggleCarrito = (e) => {
    e.preventDefault();
    
    if (yaEnCarrito) {
      // Si ya está en el carrito, eliminarlo
      eliminarProducto(id);
      showWarningToast(`🗑️ ${title} eliminado del carrito`);
    } else {
      // Si no está, agregarlo
      const producto = { id, nombre: title };
      const validacion = validarProductoCarrito(producto);
      
      if (!validacion.valido) {
        console.error('Error al agregar producto:', validacion.mensaje);
        return;
      }
      
      agregarProducto(producto);
      showSuccessToast(`🛒 ${title} agregado al carrito`);
    }
  };

  return (
    <Link 
      to={`/producto/${id}`} 
      style={{ textDecoration: 'none', color: 'inherit' }}
      aria-label={`Ver detalles de ${title}`}
    >
      <div 
        className="card card-hover-effect" 
        onClick={e => { 
          if (e.target.closest('.card-btn')) e.preventDefault(); 
        }}
        role="article"
        aria-labelledby={`product-title-${id}`}
        aria-describedby={`product-description-${id}`}
      >
        <div className="card-img" style={{ position: 'relative' }}>
          <BotonFavorito 
            producto={{ id, titulo: title }} 
            size="medium" 
          />
          <div className="img">
            <LazyImage 
              src={srcimg} 
              alt={alt}
              fallbackSrc="/imgs/placeholder-product.jpg"
            />
          </div>
        </div>
        <div 
          className="card-title" 
          id={`product-title-${id}`}
        >
          {title}
        </div>
        <div 
          className="card-subtitle" 
          id={`product-description-${id}`}
        >
          {description}
        </div>
        <hr className="card-divider" />
        <div className="card-footer">
          <div className="card-price">
            <span aria-label="Precio">$</span> {price}
          </div>
          <button
            className="card-btn"
            onClick={handleToggleCarrito}
            title={yaEnCarrito 
              ? `Quitar del carrito${cantidad > 1 ? ` (${cantidad})` : ''}` 
              : 'Agregar al carrito'
            }
            aria-label={yaEnCarrito 
              ? `Quitar ${title} del carrito${cantidad > 1 ? `, cantidad actual: ${cantidad}` : ''}` 
              : `Agregar ${title} al carrito`
            }
            style={{ 
              background: yaEnCarrito ? '#ff6b6b' : undefined, 
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            {yaEnCarrito ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 14, 
                fontWeight: 'bold',
                color: '#fff'
              }}>
                ✖
                {cantidad > 1 && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#FFD700',
                    color: '#222',
                    borderRadius: '50%',
                    fontSize: 10,
                    padding: '2px 4px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cantidad}
                  </span>
                )}
              </div>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512"
                aria-hidden="true"
              >
                <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path>
                <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}