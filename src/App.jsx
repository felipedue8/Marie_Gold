import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from './Home';
import { Categoria } from './Categoria';
import './index.css';
import { Ramos } from './PaginasNavegacion/ramos';
import { Manillas } from './PaginasNavegacion/Manillas';
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contenedorRef = useRef(null);

  return (
    <Router>
      <header className="main-header">
        <div className="header-row">
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <img src="/imgs/logoPrincipal-removebg-preview.png" alt="Logo" style={{ cursor: 'pointer', height: '160px', marginRight: '10px' }} />
            <h1 style={{ cursor: 'pointer', margin: 0 }}>Marie Golden</h1>
          </Link>
        </div>
        <div className="header-row">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰ Cosas Facinantes Aqui
          </button>
        </div>
      </header>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <nav className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <ul>
          <li><Link to="/manillas" onClick={() => setSidebarOpen(false)}>Manillas</Link></li>
          <li><Link to="/aretes" onClick={() => setSidebarOpen(false)}>Aretes</Link></li>
          <li><Link to="/anillos" onClick={() => setSidebarOpen(false)}>Anillos</Link></li>
          <li><Link to="/accesorios" onClick={() => setSidebarOpen(false)}>Accesorios</Link></li>
          <li><Link to="/ramos" onClick={() => setSidebarOpen(false)}>Ramos</Link></li>
          <li><Link to="/crea" onClick={() => setSidebarOpen(false)}>Crea la tuya</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/aretes" element={<Categoria nombre="Aretes" />} />
        <Route path="/manillas" element={<Manillas nombre="Manillas" />} />
        <Route path="/anillos" element={<Categoria nombre="Anillos" />} />
        <Route path="/accesorios" element={<Categoria nombre="Accesorios" />} />
        <Route path="/ramos" element={<Ramos nombre="Ramos" />} />
        <Route path="/crea" element={<Categoria nombre="Crea la tuya" />} />
        <Route path="/" element={<Home />} />
      </Routes>
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
    </Router>
  );
}