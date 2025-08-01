import React from 'react';
import { useFavoritosContext } from '../FavoritosContext';
import { showSuccessToast } from './Toast';

export function BotonFavorito({ producto, size = 'medium', style = {} }) {
  const { esFavorito, toggleFavorito } = useFavoritosContext();
  const isFav = esFavorito(producto.id);

  const sizes = {
    small: { width: '28px', height: '28px', fontSize: '14px' },
    medium: { width: '36px', height: '36px', fontSize: '18px' },
    large: { width: '44px', height: '44px', fontSize: '22px' }
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const added = toggleFavorito(producto);
    
    if (added) {
      showSuccessToast(`💖 ${producto.titulo} agregado a favoritos`);
    } else {
      showSuccessToast(`💔 ${producto.titulo} eliminado de favoritos`);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isFav ? '#ff4757' : '#ddd',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
        ...sizes[size],
        ...style
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.background = 'rgba(255, 255, 255, 1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
      }}
      title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
}
