import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

// Funciones para localStorage
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

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(cargarCarritoDesdeStorage);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    guardarCarritoEnStorage(carrito);
  }, [carrito]);

  function agregarProducto(producto) {
    setCarrito(prev => {
      const existe = prev.find(item => String(item.id) === String(producto.id));
      if (existe) {
        // Si ya existe, incrementar cantidad
        return prev.map(item =>
          String(item.id) === String(producto.id)
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        // Si no existe, agregar con cantidad 1
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  }

  function eliminarProducto(id) {
    setCarrito(prev => prev.filter(item => String(item.id) !== String(id)));
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
