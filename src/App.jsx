import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CarritoProvider } from './CarritoContext';
import { FavoritosProvider } from './FavoritosContext';
import { BusquedaProvider, useBusqueda } from './BusquedaContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BotonFlotanteCarrito } from './BotonFlotanteCarrito';
import { ToastContainer } from './components/Toast';
import { PageLoader, useRouteTransition } from './components/PageTransition';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { Home } from './Home';
import { Categoria } from './Categoria';
import './index.css';
import { Ramos } from './PaginasNavegacion/Ramos';
import { CrearManilla } from './PaginasNavegacion/CrearManilla';
import { Manillas } from './PaginasNavegacion/Manillas';
import { ProductoDetalle } from './PaginasNavegacion/ProductoDetalle';
import { categoriasMenu } from './PaginasNavegacion/categoriasMenu';
import { ProductosPaginados } from './PaginasNavegacion/ProductosPaginados';
import { productos } from './productos';
import { SpeedInsights } from "@vercel/speed-insights/react";

export function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <CarritoProvider>
          <Router>
            <BusquedaProvider>
              <AppContent />
            </BusquedaProvider>
          </Router>
        </CarritoProvider>
      </FavoritosProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isLoading } = useRouteTransition();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const contenedorRef = useRef(null);
  
  // Usar el hook de búsqueda
  const { 
    termino, 
    setTermino, 
    resultados, 
    mostrarResultados, 
    buscar, 
    limpiarBusqueda 
  } = useBusqueda();

  // Verificar si estamos en ruta de admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // Si estamos cargando la autenticación, mostrar loader
  if (authLoading) {
    return <PageLoader show={true} />;
  }

  // Si es ruta de admin, mostrar login o panel según autenticación
  if (isAdminRoute) {
    return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
  }


  // Menú de links extra para el dropdown (independiente de categoriasMenu)
  const linksExtra = [
    { nombre: 'Collares', ruta: '/collares' },
    { nombre: 'Peluches', ruta: '/peluches' },
    { nombre: 'Tobilleras', ruta: '/tobilleras' },
    { nombre: 'Patos personalizados', ruta: '/patos-personalizados' },
    { nombre: 'Perros y Gatos Flor', ruta: '/perros-gatos-flor' },
    { nombre: 'Anime y bandas', ruta: '/anime-bandas' },
    { nombre: 'Detalles en rosas eternas', ruta: '/rosas-eternas' },
    { nombre: 'Pines', ruta: '/pines' },
    { nombre: 'Llaveros', ruta: '/llaveros' }
    // Puedes agregar más aquí
  ];

  return (
    <>
      <ToastContainer />
      <PageLoader show={isLoading} />
      <header className="main-header">
        <div className="header-row">
          <Link
            to="/"
            onClick={limpiarBusqueda}
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
          {/* Buscador solo en PC */}
          <form
            className="buscador-pc"
            onSubmit={e => {
              e.preventDefault();
              if (buscar(termino)) {
                setSidebarOpen(false);
              }
            }}
            style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 8 }}
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={termino}
              onChange={e => setTermino(e.target.value)}
              style={{ fontSize: 18, padding: '6px 10px', borderRadius: 8, border: '1px solid #ccc', fontFamily: 'inherit' }}
            />
            <button type="submit" style={{ fontSize: 18, padding: '6px 14px', borderRadius: 8, background: '#FFD700', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Buscar</button>
            {mostrarResultados && (
              <button type="button" onClick={limpiarBusqueda} style={{ marginLeft: 4, fontSize: 18, padding: '6px 10px', borderRadius: 8, background: '#ffb3b3', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>X</button>
            )}
          </form>
        </div>
      {/* Botón flotante de búsqueda solo en móvil */}
      <button
        className="boton-flotante-busqueda"
        onClick={() => {
          setShowMobileSearch(true);
          setSidebarOpen(false);
        }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          background: '#FFD700',
          color: '#a0522d',
          border: 'none',
          borderRadius: '50%',
          width: 60,
          height: 60,
          fontSize: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'none'
        }}
      >
        🔍
      </button>
      {/* Modal de búsqueda en móvil */}
      {showMobileSearch && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={e => {
            // Only close if clicking the overlay, not the form
            if (e.target === e.currentTarget) {
              setShowMobileSearch(false);
              setSidebarOpen(false);
            }
          }}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              if (buscar(termino)) {
                setShowMobileSearch(false);
                setSidebarOpen(false);
              }
            }}
            style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 260, maxWidth: 320, width: '80vw', boxShadow: '0 2px 16px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 12 }}
            onClick={e => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={termino}
              onChange={e => setTermino(e.target.value)}
              style={{ fontSize: 18, padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontFamily: 'inherit' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="submit" style={{ fontSize: 18, padding: '6px 18px', borderRadius: 8, background: '#FFD700', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Buscar</button>
              <button type="button" onClick={() => { setShowMobileSearch(false); setSidebarOpen(false); }} style={{ fontSize: 18, padding: '6px 10px', borderRadius: 8, background: '#ffb3b3', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
        <div className="header-row">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ✨ Descubre Nuestra Magia ✨
          </button>
        </div>
      </header>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <nav className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <ul>
          <li><Link to="/manillas" onClick={() => { setSidebarOpen(false); limpiarBusqueda(); }}>Manillas</Link></li>
          <li><Link to="/aretes" onClick={() => { setSidebarOpen(false); limpiarBusqueda(); }}>Aretes</Link></li>
          <li><Link to="/anillos" onClick={() => { setSidebarOpen(false); limpiarBusqueda(); }}>Anillos</Link></li>
          <li><Link to="/accesorios" onClick={() => { setSidebarOpen(false); limpiarBusqueda(); }}>Accesorios</Link></li>
          <li><Link to="/ramos" onClick={() => { setSidebarOpen(false); limpiarBusqueda(); }}>Ramos</Link></li>
          <li><Link to="/crea" onClick={() => { setSidebarOpen(false); limpiarBusqueda(); }}>Crea la tuya</Link></li>
          {/* PC: menú desplegable, móvil: links normales */}
          <li className="dropdown-pc">
            <button
              className="dropdown-btn-pc"
              onClick={() => setDropdownOpen(d => !d)}
            >
              Más categorías {dropdownOpen ? '▲' : '▼'}
            </button>
            {dropdownOpen && (
              <ul className="dropdown-list-pc">
                {linksExtra.map(link => (
                  <li key={link.ruta}>
                    <Link to={link.ruta} onClick={() => { setSidebarOpen(false); setDropdownOpen(false); limpiarBusqueda(); }}>
                      {link.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* En móvil, los links extra se muestran como <li> normales justo debajo */}
          {linksExtra.map(link => (
            <li key={link.ruta} className="extra-mobile">
              <Link to={link.ruta} onClick={() => {
                setSidebarOpen(false);
                setDropdownOpen(false);
                limpiarBusqueda();
              }}>
                {link.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <Routes>
        <Route path="/aretes" element={<Categoria nombre="Aretes" />} />
        <Route path="/manillas" element={<Manillas nombre="Manillas" sidebarOpen={sidebarOpen} />} />
        <Route path="/anillos" element={<Categoria nombre="Anillos" />} />
        <Route path="/accesorios" element={<Categoria nombre="Accesorios" />} />
        <Route path="/ramos" element={<Ramos nombre="Ramos" sidebarOpen={sidebarOpen} />} />
        <Route path="/crea" element={<Categoria nombre="Crea la tuya" />} />
        {/* Rutas para las nuevas categorías */}
        <Route path="/collares" element={<Categoria nombre="Collares" />} />
        <Route path="/peluches" element={<Categoria nombre="Peluches" />} />
        <Route path="/tobilleras" element={<Categoria nombre="Tobilleras" />} />
        <Route path="/patos-personalizados" element={<Categoria nombre="Patos personalizados" />} />
        <Route path="/perros-gatos-flor" element={<Categoria nombre="Perros y Gatos Flor" />} />
        <Route path="/anime-bandas" element={<Categoria nombre="Anime y bandas" />} />
        <Route path="/rosas-eternas" element={<Categoria nombre="Detalles en rosas eternas" />} />
        <Route path="/pines" element={<Categoria nombre="Pines" />} />
        <Route path="/llaveros" element={<Categoria nombre="Llaveros" />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/admin" element={<div>Ruta administrativa - redirección automática</div>} />
        <Route path="/" element={
          /* Resultados de búsqueda o Home */
          mostrarResultados ? (
            <div style={{marginTop: 24}}>
              <button
                style={{
                  marginBottom: 16,
                  padding: '8px 18px',
                  borderRadius: 8,
                  background: '#FFD700',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  fontFamily: 'inherit'
                }}
                onClick={() => {
                  limpiarBusqueda();
                }}
              >
                Volver
              </button>
              <ProductosPaginados
                prefijoId={""}
                titulo={`Resultados para: "${termino}"`}
                productosCustom={resultados}
              />
            </div>
          ) : (
            <Home />
          )
        } />
      </Routes>
      <BotonFlotanteCarrito />
      <SpeedInsights />
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
          <div className="admin-access" style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link 
              to="/admin" 
              style={{ 
                color: '#999', 
                fontSize: '10px', 
                textDecoration: 'none',
                opacity: 0.5,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={e => e.target.style.opacity = '1'}
              onMouseLeave={e => e.target.style.opacity = '0.5'}
            >
              •
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
