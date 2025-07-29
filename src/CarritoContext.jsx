import React, { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]); // [{id, nombre}]

  function agregarProducto(producto) {
    setCarrito(prev => [...prev, producto]);
  }

  function limpiarCarrito() {
    setCarrito([]);
  }

  return (
    <CarritoContext.Provider value={{ carrito, agregarProducto, limpiarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
