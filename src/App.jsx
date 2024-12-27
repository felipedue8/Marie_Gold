import React,{useRef, useEffect} from 'react';
import './App.css'
import dere from "./imgs/dere.png";
import izqui from "./imgs/izqu.png";

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
      if (contenedor.scrollLeft >= contenedor.scrollWidth / 2) {
        contenedor.scrollLeft = 0;
      } else if (contenedor.scrollLeft === 0) {
        contenedor.scrollLeft = contenedor.scrollWidth / 2;
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
        left: -150,
        behavior: 'smooth',
      });
    }
  } 
  const clickdr =() =>{
   const contenedor = contenedorRef.current;
    if (contenedor) {
      contenedor.scrollBy({
        left: 150,
        behavior: 'smooth',
      });
    }
  } 
  
  return (
    <>
      <header>
      <img src="https://www.dropbox.com/scl/fi/vc6ba56dfr7e1apf10ia8/IMG-20230409-WA0005-removebg-preview.png?rlkey=olbdtfl8tdzb687zx1imshtla&st=kmydvt30&raw=1" alt="" />
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
      <img src="https://www.dropbox.com/scl/fi/0ynupo162tg32a5pylp70/IMG_20240921_164430.jpg?rlkey=b6rath9h5xjm63dcepsqfqgwz&st=ldnstxtj&raw=1" alt=""/>
      <img src="https://www.dropbox.com/scl/fi/9qmbcs6p3bi1mipx0r61u/IMG_20240928_103556.jpg?rlkey=rsxzwmi05rbiaug2h9sqk562p&st=5uhdc2br&raw=1" alt="Imagen desde Dropbox"/>
      <img src="https://www.dropbox.com/scl/fi/ppcjh5r00rr6blzmskx6u/IMG_20241129_154458.jpg?rlkey=1r5ruocvw6mnwvd5tz0qsgyp0&st=lug3u4p8&raw=1" alt="Imagen desde Dropbox"/>
      <img src="https://www.dropbox.com/scl/fi/qjo1yjlh038zir5umf0ul/IMG_20241130_190716.jpg?rlkey=486jbp6iq5oct5ima45ez8cx1&st=9xel5w3h&raw=1" alt="Imagen desde Dropbox"/>
      <img src="https://www.dropbox.com/scl/fi/80mlabem0toj6mh37cu8x/IMG_20241217_114723.jpg?rlkey=1dizzzuztpi2wzssaych31iz5&st=l0x3xd03&raw=1" alt="Imagen desde Dropbox"/>
      <img src="https://www.dropbox.com/scl/fi/4gquryrgt99poe48t9chq/IMG-20231130-WA0057.jpg?rlkey=9zkbve5e7v9i1hzl15cezxeeq&st=p94wpvtg&raw=1" alt="Imagen desde Dropbox"/>
      <img src="https://www.dropbox.com/scl/fi/3mnwfl341q7o4hwd6qzd4/IMG_20241216_142135.jpg?rlkey=hwppv98qhrzvdl9oyd7ic6drz&st=zuzwt22z&raw=1" alt="Imagen desde Dropbox"/>
      <img src="https://www.dropbox.com/scl/fi/0tgyg0f5ltqxo54xdc868/IMG_20241010_162433.jpg?rlkey=qperxuqtdrmfqg17bucxgqs6w&st=z9qxbtwc&raw=1" alt="Imagen desde Dropbox"/>

      <img src="https://www.dropbox.com/scl/fi/k91o8lb7x2eptirlsgvnn/IMG_20241212_103849.jpg?rlkey=orb46i55rxbizs0pfi367igu7&st=lc3lu2oq&raw=1" alt="" />
      </div>
      </div>
    </>
  )
 
  
}


