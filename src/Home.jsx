import React from 'react';
import dere from "./imgs/dere.png";
import izqui from "./imgs/izqu.png";
import { tarjetas } from './Tarjetas';
import { productos } from './productos';

export function Home({ clickiz, clickdr, contenedorRef }) {
  return (
    <>
      <div className='contenedor_padre'>
        <div className='botones'>
          <img onClick={clickiz} className='iz' src={izqui} alt="" />
          <img onClick={clickdr} className='dr' src={dere} alt="" />
        </div>
        <div ref={contenedorRef} className='fondo_imagenes'>
          <img src="/ramos/cajita_con_rosas_eternas_con_mensaje_y_fotos.webp" alt="joyas" />
          <img src="/ramos/cajita_con_rosas_eternas_y_peluche.webp" alt="joyas" />
          <img src="/ramos/cajita_con_tapa_de_rosas_eternas.webp" alt="joyas" />
          <img src="/ramos/cajita_con_tapa_rosas_eternas.webp" alt="joyas" />
          <img src="/ramos/cajita_con_tapa, rosas_eternas_y_peluche.webp" alt="joyas" />
          <img src="/ramos/cajita_de_rosas_eternas_con_ferrero_rocher.webp" alt="joyas" />
          <img src="/ramos/cajita_de_rosas_eternas_con_hotwhells.webp" alt="joyas" />
          <img src="/ramos/Ramo rosas azules .webp" alt="joyas" />
          <img src="/ramos/Ramo seis rosa azules carros.webp" alt="joyas" />
        </div>
      </div>
      <div className='productos_temporada_titulo'>
        <h2>AHORA EN SAN VALENTIN</h2>
        <div className='productos_temporada'>
          {productos.map((producto) => (
            <div key={producto.id} className="tarjeta">
              {tarjetas(producto.titulo, producto.descripcion, producto.precio, producto.imagen, producto.alt)}
            </div>
          ))}
        </div>
      </div>
      {/* Puedes mover el footer aquí si quieres que esté solo en Home */}
    </>
  );
}