import React, { createContext, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarBusqueda } from './utils/validaciones';
import { productos } from './productos';

const BusquedaContext = createContext();

export function BusquedaProvider({ children }) {
  const navigate = useNavigate();
  const [termino, setTermino] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Realizar búsqueda con validación
  const resultados = useMemo(() => {
    if (!termino.trim()) return [];
    
    const validacion = validarBusqueda(termino);
    if (!validacion.valido) return [];

    const terminoLimpio = validacion.termino.toLowerCase();
    
    return productos.filter(producto => {
      if (!producto.titulo || !producto.descripcion) return false;
      
      return (
        producto.titulo.toLowerCase().includes(terminoLimpio) ||
        producto.descripcion.toLowerCase().includes(terminoLimpio)
      );
    });
  }, [termino]);

  const buscar = (nuevoTermino) => {
    const validacion = validarBusqueda(nuevoTermino);
    if (!validacion.valido) {
      console.warn('Búsqueda inválida:', validacion.mensaje);
      return false;
    }
    
    setTermino(nuevoTermino);
    setMostrarResultados(true);
    
    // Navegar a la página principal para mostrar los resultados
    navigate('/');
    
    return true;
  };

  const limpiarBusqueda = () => {
    setTermino("");
    setMostrarResultados(false);
  };

  return (
    <BusquedaContext.Provider value={{
      termino,
      setTermino,
      resultados,
      mostrarResultados,
      buscar,
      limpiarBusqueda
    }}>
      {children}
    </BusquedaContext.Provider>
  );
}

export function useBusqueda() {
  const context = useContext(BusquedaContext);
  if (!context) {
    throw new Error('useBusqueda debe ser usado dentro de un BusquedaProvider');
  }
  return context;
}
