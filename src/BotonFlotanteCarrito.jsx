import React from 'react';
import { useCarrito } from './CarritoContext';

const NUMERO_WHATSAPP = '573227878174';

export function BotonFlotanteCarrito() {
  const { carrito, limpiarCarrito } = useCarrito();
  const cantidad = carrito.length;
  const nombres = carrito.map(p => p.nombre).join(', ');
  const mensaje = encodeURIComponent(`Hola equipo de Mariegold me encantaria saber si me puedes dar mas informacion de: ${nombres}`);
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;

  if (cantidad === 0) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        background: '#25D366',
        color: '#fff',
        borderRadius: '50%',
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px #0005',
        fontSize: 32,
        zIndex: 2000,
        textDecoration: 'none',
      }}
      title="Ir a WhatsApp con tu carrito"
      onClick={limpiarCarrito}
    >
      <span style={{ position: 'absolute', top: 8, right: 8, background: '#cfbc4d', color: '#222', borderRadius: '50%', fontSize: 14, padding: '2px 7px', fontWeight: 'bold' }}>{cantidad}</span>
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C9.37258 3 4 8.37258 4 15C4 17.3892 4.80344 19.6016 6.17071 21.4142L4.5 28L11.0858 26.3293C12.8984 27.6966 15.1108 28.5 17.5 28.5C24.1274 28.5 29.5 23.1274 29.5 16.5C29.5 9.87258 24.1274 4.5 17.5 4.5C17.5 4.5 16 3 16 3Z" stroke="white" strokeWidth="2"/>
      </svg>
    </a>
  );
}
