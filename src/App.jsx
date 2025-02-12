import React,{useRef, useEffect} from 'react';
import dere from "./imgs/dere.png";
import izqui from "./imgs/izqu.png";
import { tarjetas } from './Tarjetas';


export  function App() {
   const contenedorRef = useRef(null);
   useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    // Duplica el contenido para permitir el efecto infinito
    const originalContent = contenedor.innerHTML;
    contenedor.innerHTML += originalContent;

    // Resetea el scroll cuando llega al final
    const handleScroll = () => {
      if (contenedor.scrollLeft >= contenedor.scrollWidth / 1.9) {
        contenedor.scrollLeft = 0.2;
      } else if (contenedor.scrollLeft === 0.2) {
        contenedor.scrollLeft = contenedor.scrollWidth / 1.9;
      }
    };
      contenedor.addEventListener('scroll', handleScroll);

       return () => {
      contenedor.removeEventListener('scroll', handleScroll);
        };
       }, []);
            
  const clickiz =() =>{
    const contenedor = contenedorRef.current;
    if (contenedor) {
      contenedor.scrollBy({
        left: -140,
        behavior: 'smooth',
      });
    }
  } 
  const clickdr =() =>{
   const contenedor = contenedorRef.current;
    if (contenedor) {
      contenedor.scrollBy({
        left: 140,
        behavior: 'smooth',
      });
    }
  } 
  
  return (
    <>
      <header>
      <img src="/imgs/logoPrincipal.jpg" alt="Logo" />

      <h1>Marie Golden</h1> 
      
      </header>
      <nav>

          <ul>
            <li>Mainllas</li>
            <li>Aretes</li>
            <li>Anilos</li>
            <li>Accesorios</li>
            <li>Ramos</li>
            <li>Crea la tuya</li>
          </ul>
          
        </nav>
       <div className='contenedor_padre'>
        <div className='botones'>
      <img onClick={clickiz} className='iz'  src={izqui} alt="" />
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
            {tarjetas("ramo de flores + ferrero","ramo de flores de diferentes colores combinado con cholate ferrero", "60.000","/imagenes_ramos/Ramo_rosas_azules.jpg","Ramo de rosas azules")}
            {tarjetas("Girasol en cajita","Girasol en cajita con tarjeta personalizada", "20.000","/peluches/girasol_en_cajita_con_peluche_pequeño.webp","Girasol en cajita")}
            {tarjetas("Osito graduado","Peluche de oso graduado", "30.000","/peluches/osito_graduado_mediano.webp","Peluche de oso graduado")}
            {tarjetas("Peluche graduado mediano","peluche graduado", "30.000","/peluches/peluche_graduado_mediano-8.webp","Peluche graduado mediano")}
            {tarjetas("Peluche graduado grande","peluche graduado", "50.000","/peluches/peluche_mediano_graduado-4.webp","Peluche graduado grande")}
            {tarjetas("Peluche graduado con tematica","peluche graduado", "50.000","/peluches/ramo_mediano_con_peluche_tematica_de_grado.webp","Peluche graduado grande")}
            

        </div>
      </div>
      <footer>
      <div className='footer_izquierda'>
        <div className='logo_descripcion'>
          <img src="/imgs/vaca_dorada_footer.png" alt="logo Marie Golden" />
          <div className='descripcion'>
          <h3>Marie Golden</h3>
          <p>En Marie Golden, la pasión y la creatividad se entrelazan para crear joyas y accesorios únicos que enamoran. Cada pieza es una obra de arte elaborada a mano con materiales de alta calidad, transmitiendo emociones y sentimientos que te conectarán con su alma. Nuestras joyas y accesorios son extensiones de tu personalidad, narrativas que cuentan tu historia y celebran tu esencia. </p>
          </div>
        </div>
        <div className='redes_sociales'>
          <a href="https://wa.me/+573227878174?text=Vi%20tu%20pagina%20web%20y%20me%20interesa%20tener%20mas%20informacion%20sobre%20tus%20productos">
          <img src="/imgs/whatsapp_footer.png" alt="logo whatsapp" />
          <span className='info_redes'>+57 322 7878174</span>
          </a>
          <a href="https://www.instagram.com/mar.iegolden?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
          <img src="/imgs/instagram_footer.png" alt="logo instagram" />
          <span className='info_redes'>mar.iegolden</span>
          </a>
          <a href="https://www.tiktok.com/@mariegolden27?is_from_webapp=1&sender_device=pc">
          <img src="/imgs/tik_tok_footer.png" alt="logo tiktok" />
          <span className='info_redes'>@mariegolden </span>

          </a>
         </div>
      </div>
      
      

     
      

      </footer>
    </>

  
  )
  
 
  
}


