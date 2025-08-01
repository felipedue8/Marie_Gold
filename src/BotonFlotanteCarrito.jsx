import React from 'react';
import { useCarrito } from './CarritoContext';
import { useWindowSize } from './hooks/useWindowSize';

const NUMERO_WHATSAPP = '573227878174';

export function BotonFlotanteCarrito() {
  const { carrito, totalProductos, limpiarCarrito } = useCarrito();
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  
  if (totalProductos === 0) return null;

  // Crear mensaje mejorado con cantidades
  const productosTexto = carrito.map(producto => {
    const cantidad = producto.cantidad || 1;
    return cantidad > 1 ? `${producto.nombre} (x${cantidad})` : producto.nombre;
  }).join(', ');
  
  const mensaje = encodeURIComponent(
    `Hola equipo de Marie Golden! 👋\n\n` +
    `Me encantaría saber más información sobre estos productos:\n\n` +
    `📝 Productos seleccionados:\n${productosTexto}\n\n` +
    `🛒 Total de productos: ${totalProductos}\n\n` +
    `¡Gracias por su atención! 💖`
  );
  
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ir a WhatsApp con ${totalProductos} producto${totalProductos > 1 ? 's' : ''} en el carrito`}
      style={{
        position: 'fixed',
        bottom: isMobile ? 24 : 32,
        right: isMobile ? 20 : 32,
        background: '#25D366',
        color: '#fff',
        borderRadius: '50%',
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
        fontSize: 28,
        zIndex: 2000,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        border: '3px solid #fff',
      }}
      title="Contactar por WhatsApp"
      onClick={limpiarCarrito}
      onMouseEnter={e => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
      }}
      onMouseLeave={e => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
      }}
    >
      <span 
        style={{ 
          position: 'absolute', 
          top: -8, 
          right: -8, 
          background: '#FFD700', 
          color: '#222', 
          borderRadius: '50%', 
          fontSize: 12, 
          padding: '4px 8px', 
          fontWeight: 'bold',
          minWidth: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {totalProductos}
      </span>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
      </svg>
    </a>
  );
}
