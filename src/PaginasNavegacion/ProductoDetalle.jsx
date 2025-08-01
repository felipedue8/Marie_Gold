
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../productos';
import { useCarrito } from '../CarritoContext';
import { BotonFavorito } from '../components/BotonFavorito';
import { AnimatedPage } from '../components/PageTransition';
import { showSuccessToast, showWarningToast } from '../components/Toast';

export function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto, eliminarProducto, carrito } = useCarrito();
  const producto = productos.find(p => String(p.id) === id);
  
  // Scroll al top cuando se carga el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Verificar si el producto ya está en el carrito
  const productoEnCarrito = carrito.find(p => String(p.id) === String(id));
  const yaEnCarrito = !!productoEnCarrito;
  const cantidad = productoEnCarrito?.cantidad || 0;

  if (!producto) return <div style={{padding: 40}}>Producto no encontrado</div>;

  const handleToggleCarrito = () => {
    if (yaEnCarrito) {
      eliminarProducto(producto.id);
      showWarningToast(`🗑️ ${producto.titulo} eliminado del carrito`);
    } else {
      agregarProducto({ id: producto.id, nombre: producto.titulo });
      showSuccessToast(`🛒 ${producto.titulo} agregado al carrito`);
    }
  };
 
  const handleVolver = () => {
    navigate(-1);
    // Pequeño delay para asegurar que la navegación ocurra primero
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <AnimatedPage>
      <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: 24, position: 'relative' }}>
        <BotonFavorito 
          producto={producto} 
          size="large" 
          style={{ top: '16px', right: '16px' }}
        />
        <button onClick={handleVolver} style={{ marginBottom: 16, background: '#f3ade2', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', color: '#222', fontWeight: 'bold' }}>⟵ Volver</button>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <img 
          src={producto.imagen} 
          alt={producto.alt} 
          style={{ 
            width: '350px', 
            height: '350px', 
            objectFit: 'cover',
            borderRadius: 8 
          }} 
        />
      </div>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>{producto.titulo}</h2>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>{producto.descripcion}</p>
      <div style={{ fontWeight: 'bold', fontSize: 24, margin: '1rem 0', color: '#cfbc4d' }}>${producto.precio}</div>
      <button
        onClick={handleToggleCarrito}
        style={{
          marginTop: 24,
          background: yaEnCarrito ? '#ff6b6b' : '#2d8cf0',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 24px',
          fontSize: 18,
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0002',
          transition: 'background 0.2s',
        }}
      >
        {yaEnCarrito 
          ? `Quitar del carrito ${cantidad > 1 ? `(${cantidad})` : ''}` 
          : 'Añadir al carrito 🛒'
        }
      </button>
      </div>
    </AnimatedPage>
  );
}
