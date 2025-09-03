import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

// Funciones para localStorage (fallback)
const CARRITO_KEY = 'marie-golden-carrito';

function cargarCarritoDesdeStorage() {
  try {
    const carritoGuardado = localStorage.getItem(CARRITO_KEY);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  } catch (error) {
    console.error('Error al cargar carrito desde localStorage:', error);
    return [];
  }
}

function guardarCarritoEnStorage(carrito) {
  try {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  } catch (error) {
    console.error('Error al guardar carrito en localStorage:', error);
  }
}

// Funciones para API (usuario logueado)
async function cargarCarritoDesdeAPI(usuario_id) {
  try {
    const response = await fetch(`/api/usuario-productos?usuario_id=${usuario_id}&tipo=carrito`);
    if (response.ok) {
      const data = await response.json();
      return data.map(item => ({
        id: item.producto_id,
        cantidad: item.cantidad
      }));
    }
  } catch (error) {
    console.error('Error al cargar carrito desde API:', error);
  }
  return [];
}

async function sincronizarCarritoConAPI(usuario_id, carrito) {
  try {
    // Para cada producto en el carrito, sincronizar con la API
    for (const item of carrito) {
      await fetch('/api/usuario-productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id,
          producto_id: item.id,
          tipo: 'carrito'
        })
      });
    }
  } catch (error) {
    console.error('Error al sincronizar carrito:', error);
  }
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(cargarCarritoDesdeStorage);
  const [usuario, setUsuario] = useState(null);

  // Detectar cambios de usuario logueado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado);
      setUsuario(usuarioData);
      // Cargar carrito del usuario desde la API
      cargarCarritoDesdeAPI(usuarioData.id).then(carritoUsuario => {
        if (carritoUsuario.length > 0) {
          setCarrito(carritoUsuario);
        }
      });
    }

    // Escuchar cambios en el usuario (login/logout)
    const manejarCambioUsuario = () => {
      const usuarioActual = localStorage.getItem('usuario');
      if (usuarioActual) {
        const usuarioData = JSON.parse(usuarioActual);
        setUsuario(usuarioData);
        cargarCarritoDesdeAPI(usuarioData.id).then(carritoUsuario => {
          setCarrito(carritoUsuario);
        });
      } else {
        setUsuario(null);
        setCarrito(cargarCarritoDesdeStorage()); // Fallback a localStorage
      }
    };

    window.addEventListener('storage', manejarCambioUsuario);
    return () => window.removeEventListener('storage', manejarCambioUsuario);
  }, []);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    guardarCarritoEnStorage(carrito);
  }, [carrito]);

  async function agregarProducto(producto) {
    const nuevoCarrito = carrito.find(item => String(item.id) === String(producto.id))
      ? carrito.map(item =>
          String(item.id) === String(producto.id)
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        )
      : [...carrito, { ...producto, cantidad: 1 }];

    setCarrito(nuevoCarrito);

    // Si hay usuario logueado, sincronizar con API
    if (usuario) {
      try {
        await fetch('/api/usuario-productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuario.id,
            producto_id: producto.id,
            tipo: 'carrito'
          })
        });
      } catch (error) {
        console.error('Error al sincronizar con API:', error);
      }
    }
  }

  async function eliminarProducto(id) {
    const nuevoCarrito = carrito.filter(item => String(item.id) !== String(id));
    setCarrito(nuevoCarrito);

    // Si hay usuario logueado, sincronizar con API
    if (usuario) {
      try {
        await fetch('/api/usuario-productos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuario.id,
            producto_id: id,
            tipo: 'carrito'
          })
        });
      } catch (error) {
        console.error('Error al sincronizar eliminación con API:', error);
      }
    }
  }

  function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id);
      return;
    }
    setCarrito(prev =>
      prev.map(item =>
        String(item.id) === String(id)
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }

  function limpiarCarrito() {
    setCarrito([]);
  }

  // Funciones útiles adicionales
  const totalProductos = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
  const productosUnicos = carrito.length;

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      agregarProducto, 
      eliminarProducto,
      actualizarCantidad,
      limpiarCarrito,
      totalProductos,
      productosUnicos
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
