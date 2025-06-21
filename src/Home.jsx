import { useState } from 'react';
import React from 'react';
import dere from "./imgs/dere.png";
import izqui from "./imgs/izqu.png";
import { tarjetas } from './Tarjetas';
import { productos } from './productos.js';
import { LazyImage } from "./LazyImage.jsx";

const PRODUCTOS_POR_PAGINA = 10; // <--- AGREGA ESTA LÍNEA

export function Home({ clickiz, clickdr, contenedorRef }) {
  const [pagina, setPagina] = useState(1);
  const productosAleatorios = [...productos].sort(() => Math.random() - 0.5);
  const totalPaginas = Math.ceil(productosAleatorios.length / PRODUCTOS_POR_PAGINA);
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;
  const productosPagina = productosAleatorios.slice(inicio, fin);

  return (
    <>
      <div className='contenedor_padre'>
        <div className='botones'>
          <img onClick={clickiz} className='iz' src={izqui} alt="" />
          <img onClick={clickdr} className='dr' src={dere} alt="" />
        </div>
        <div ref={contenedorRef} className='fondo_imagenes'>


          <img
            src="/3.11.webp"
            onLoad={() => console.log("Cargada")}
            width={180}
            height={180}
          />
       <img
            src="/3.15.webp"
            onLoad={() => console.log("Cargada")}
            width={180}
            height={180}
          />
           <img
            src="/3.16.webp"
            onLoad={() => console.log("Cargada")}
            width={180}
            height={180}
          />
           <img
            src="/3.18.webp"
            onLoad={() => console.log("Cargada")}
            width={180}
            height={180}
          />

        </div>
      </div>


      
          <div className='productos_temporada_titulo'>
        <h2>LLevalo antes de que se acabe</h2>
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
    </>
  );
}