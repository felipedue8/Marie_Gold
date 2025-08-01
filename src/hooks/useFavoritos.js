import { useState, useEffect } from 'react';

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    try {
      const favoritosGuardados = localStorage.getItem('marie-gold-favoritos');
      if (favoritosGuardados) {
        setFavoritos(JSON.parse(favoritosGuardados));
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setFavoritos([]);
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('marie-gold-favoritos', JSON.stringify(favoritos));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  }, [favoritos]);

  const agregarAFavoritos = (producto) => {
    setFavoritos(prev => {
      const yaExiste = prev.some(fav => fav.id === producto.id);
      if (!yaExiste) {
        return [...prev, { id: producto.id, titulo: producto.titulo, fecha: new Date().toISOString() }];
      }
      return prev;
    });
  };

  const eliminarDeFavoritos = (productoId) => {
    setFavoritos(prev => prev.filter(fav => fav.id !== productoId));
  };

  const toggleFavorito = (producto) => {
    const esFavorito = favoritos.some(fav => fav.id === producto.id);
    if (esFavorito) {
      eliminarDeFavoritos(producto.id);
      return false;
    } else {
      agregarAFavoritos(producto);
      return true;
    }
  };

  const esFavorito = (productoId) => {
    return favoritos.some(fav => fav.id === productoId);
  };

  const limpiarFavoritos = () => {
    setFavoritos([]);
  };

  return {
    favoritos,
    agregarAFavoritos,
    eliminarDeFavoritos,
    toggleFavorito,
    esFavorito,
    limpiarFavoritos,
    totalFavoritos: favoritos.length
  };
}
