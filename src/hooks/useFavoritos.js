import { useState, useEffect } from 'react';

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Funciones para API
  const cargarFavoritosDesdeAPI = async (usuario_id) => {
    try {
      const response = await fetch(`/api/usuario-productos?usuario_id=${usuario_id}&tipo=favorito`);
      if (response.ok) {
        const data = await response.json();
        return data.map(item => ({
          id: item.producto_id,
          titulo: `Producto ${item.producto_id}`, // Se podría mejorar obteniendo el título real
          fecha: item.fecha
        }));
      }
    } catch (error) {
      console.error('Error al cargar favoritos desde API:', error);
    }
    return [];
  };

  // Detectar usuario logueado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado);
      setUsuario(usuarioData);
      // Cargar favoritos del usuario desde la API
      cargarFavoritosDesdeAPI(usuarioData.id).then(favoritosUsuario => {
        if (favoritosUsuario.length > 0) {
          setFavoritos(favoritosUsuario);
        }
      });
    }
  }, []);

  // Cargar favoritos desde localStorage al inicializar (fallback)
  useEffect(() => {
    if (!usuario) {
      try {
        const favoritosGuardados = localStorage.getItem('marie-gold-favoritos');
        if (favoritosGuardados) {
          setFavoritos(JSON.parse(favoritosGuardados));
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        setFavoritos([]);
      }
    }
  }, [usuario]);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('marie-gold-favoritos', JSON.stringify(favoritos));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  }, [favoritos]);

  const agregarAFavoritos = async (producto) => {
    const nuevosFavoritos = favoritos.some(fav => fav.id === producto.id) 
      ? favoritos 
      : [...favoritos, { id: producto.id, titulo: producto.titulo, fecha: new Date().toISOString() }];

    setFavoritos(nuevosFavoritos);

    // Si hay usuario logueado, sincronizar con API
    if (usuario && !favoritos.some(fav => fav.id === producto.id)) {
      try {
        await fetch('/api/usuario-productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuario.id,
            producto_id: producto.id,
            tipo: 'favorito'
          })
        });
      } catch (error) {
        console.error('Error al sincronizar favorito con API:', error);
      }
    }
  };

  const eliminarDeFavoritos = async (productoId) => {
    const nuevosFavoritos = favoritos.filter(fav => fav.id !== productoId);
    setFavoritos(nuevosFavoritos);

    // Si hay usuario logueado, sincronizar con API
    if (usuario) {
      try {
        await fetch('/api/usuario-productos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuario.id,
            producto_id: productoId,
            tipo: 'favorito'
          })
        });
      } catch (error) {
        console.error('Error al sincronizar eliminación de favorito con API:', error);
      }
    }
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
