
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../productos';
import { useCarrito } from '../CarritoContext';

export function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto, carrito } = useCarrito();
  const producto = productos.find(p => String(p.id) === id);
  const yaEnCarrito = carrito.some(p => String(p.id) === String(id));

  if (!producto) return <div style={{padding: 40}}>Producto no encontrado</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: 24 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16, background: '#f3ade2', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', color: '#222', fontWeight: 'bold' }}>⟵ Volver</button>
      <img src={producto.imagen} alt={producto.alt} style={{ width: '100%', borderRadius: 8, marginBottom: 24 }} />
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>{producto.titulo}</h2>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>{producto.descripcion}</p>
      <div style={{ fontWeight: 'bold', fontSize: 24, margin: '1rem 0', color: '#cfbc4d' }}>${producto.precio}</div>
      <button
        onClick={() => agregarProducto({ id: producto.id, nombre: producto.titulo })}
        disabled={yaEnCarrito}
        style={{
          marginTop: 24,
          background: yaEnCarrito ? '#aaa' : '#2d8cf0',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 24px',
          fontSize: 18,
          fontWeight: 'bold',
          cursor: yaEnCarrito ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px #0002',
          transition: 'background 0.2s',
        }}
      >
        {yaEnCarrito ? 'Ya en el carrito' : 'Añadir al carrito 🛒'}
      </button>
    </div>
  );
}
