
import React, { useEffect, useState } from 'react';
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
  
  // Estados para comentarios
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [usuario, setUsuario] = useState(null);
  
  // Scroll al top cuando se carga el componente
  useEffect(() => {
    window.scrollTo(0, 0);
    // Cargar usuario del localStorage
    cargarUsuario();
    // Cargar comentarios
    cargarComentarios();
  }, []);

  // Escuchar cambios en el localStorage (cuando el usuario hace login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      cargarUsuario();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // También escuchar eventos personalizados para login/logout
    window.addEventListener('userLogin', handleStorageChange);
    window.addEventListener('userLogout', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
      window.removeEventListener('userLogout', handleStorageChange);
    };
  }, []);

  const cargarUsuario = () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      setUsuario(null);
    }
  };
  
  const cargarComentarios = async () => {
    try {
      const response = await fetch(`/api/comentarios/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComentarios(data);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  };
  
  const agregarComentario = async () => {
    if (!usuario) {
      showWarningToast('Debes iniciar sesión para comentar');
      return;
    }
    
    if (!nuevoComentario.trim()) {
      showWarningToast('Escribe un comentario');
      return;
    }
    
    try {
      const response = await fetch(`/api/comentarios/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          nombre_usuario: usuario.nombre,
          comentario: nuevoComentario.trim()
        })
      });
      
      if (response.ok) {
        setNuevoComentario('');
        cargarComentarios(); // Recargar comentarios
        showSuccessToast('Comentario agregado');
      } else {
        showWarningToast('Error al agregar comentario');
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      showWarningToast('Error al agregar comentario');
    }
  };
  
  // Verificar si el producto ya está en el carrito
  const productoEnCarrito = carrito.find(p => String(p.id) === String(id));
  const yaEnCarrito = !!productoEnCarrito;
  const cantidad = productoEnCarrito?.cantidad || 0;

  if (!producto) return <div style={{padding: 40}}>❌ PRODUCTO NO ENCONTRADO - ARCHIVO ACTUALIZADO ❌</div>;

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
      <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: 24, position: 'relative' }}>
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
          : 'Añadir al carrito  🛒'
        }
      </button>
      
      {/* Sección de Comentarios */}
      <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 24 }}>
        <h3 style={{ fontSize: 20, marginBottom: 16, color: '#333' }}>💬 Comentarios</h3>
        
        {/* Formulario para agregar comentario */}
        {usuario ? (
          <div style={{ marginBottom: 24, background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
            <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
              Comentando como: <strong>{usuario.nombre}</strong>
            </div>
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Escribe tu comentario..."
              style={{
                width: '100%',
                minHeight: 80,
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 6,
                resize: 'vertical',
                fontSize: 14,
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={agregarComentario}
              style={{
                marginTop: 8,
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Publicar comentario
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: 24, padding: 16, background: '#fff3cd', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#856404' }}>
              <a href={`/login?redirect=/producto/${id}`} style={{ color: '#856404', textDecoration: 'underline' }}>
                Inicia sesión
              </a> para poder comentar
            </p>
          </div>
        )}
        
        {/* Lista de comentarios */}
        <div>
          {comentarios.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          ) : (
            comentarios.map((comentario) => (
              <div key={comentario.id} style={{ 
                marginBottom: 16, 
                padding: 12, 
                border: '1px solid #eee', 
                borderRadius: 6,
                background: '#fafafa'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 8,
                  fontSize: 12,
                  color: '#666'
                }}>
                  <strong>{comentario.nombre_usuario}</strong>
                  <span>{new Date(comentario.fecha).toLocaleDateString('es-ES')}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#333' }}>
                  {comentario.comentario}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </AnimatedPage>
  );
}
