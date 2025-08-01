import { useState, useMemo } from 'react';
import { tarjetas } from './Tarjetas';
import { productos } from './productos.js';
import { AnimatedPage } from './components/PageTransition';

const PRODUCTOS_POR_PAGINA = 10; // <--- AGREGA ESTA LÍNEA

export function Home({ contenedorRef }) {
  const [pagina, setPagina] = useState(1);
  
  // Use useMemo to randomize products only once when component mounts
  const productosAleatorios = useMemo(() => {
    return [...productos].sort(() => Math.random() - 0.5);
  }, []); // Empty dependency array means this only runs once
  
  const totalPaginas = Math.ceil(productosAleatorios.length / PRODUCTOS_POR_PAGINA);
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;
  const productosPagina = productosAleatorios.slice(inicio, fin);
  
  return (
    <AnimatedPage>
      <div className='productos_temporada_titulo'>
        <h2 style={{ 
          animation: 'slideInDown 0.5s ease-out',
          textAlign: 'center'
        }}>
          LLevalo antes de que se acabe
        </h2>
        <div className='productos_temporada'>
          {productosPagina.map((producto, index) => (
            <div 
              key={producto.id} 
              className="tarjeta"
              style={{
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animation: 'slideInUp 0.4s ease-out forwards'
              }}
            >
              {tarjetas(producto.titulo, producto.descripcion, producto.precio, producto.imagen, producto.alt, producto.id)}
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
    </AnimatedPage>
  );
}