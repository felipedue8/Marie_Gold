import { useState, useMemo } from 'react';
import { validarBusqueda } from '../utils/validaciones';
import { productos } from '../productos';

export function useBusqueda() {
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
    return true;
  };

  const limpiarBusqueda = () => {
    setTermino("");
    setMostrarResultados(false);
  };

  return {
    termino,
    setTermino,
    resultados,
    mostrarResultados,
    buscar,
    limpiarBusqueda,
    hayResultados: resultados.length > 0
  };
}
