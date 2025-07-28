import React, { useState, useMemo } from 'react';
import { tarjetas } from '../Tarjetas';
import { productos } from '../productos.js';

const PRODUCTOS_POR_PAGINA = 10;

/**
 * Componente flexible para mostrar productos paginados por rango de id.
 * @param {string} prefijoId - Prefijo que deben tener los ids de los productos (ej: '4.' para Ramos)
 * @param {string} titulo - Título a mostrar arriba de los productos
 */
export function ProductosPaginados({ prefijoId, titulo }) {
  const [pagina, setPagina] = useState(1);
  const productosFiltrados = useMemo(() =>
    productos.filter(p => String(p.id).startsWith(prefijoId)),
    [prefijoId]
  );
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  return (
    <div className='productos_temporada_titulo'>
      <h2>{titulo}</h2>
      <div className='productos_temporada'>
        {productosPagina.map((producto) => (
          <div key={producto.id} className="tarjeta">
            {tarjetas(producto.titulo, producto.descripcion, producto.precio, producto.imagen, producto.alt)}
          </div>
        ))}
      </div>
      {/* Controles de paginación */}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button
          onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
