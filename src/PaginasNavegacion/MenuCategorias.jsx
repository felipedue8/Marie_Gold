import './MenuCategocias.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { categoriasMenu } from './categoriasMenu';

export function MenuCategorias({ onCategoriaSeleccionada, categorias }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef();
  // Close dropdown if click outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Usar las categorías filtradas si se pasan, si no usar todas
  const categoriasMostrar = categorias || categoriasMenu;

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1100 }} ref={menuRef}>
      <button
        className="hamburger always-hamburger"
        style={{ margin: 0 }}
        onClick={() => setOpen(o => !o)}
      >
        ☰ Categorías
      </button>
      {open && (
        <div className="dropdown-categorias">
          <ul>
            {categoriasMostrar.map(cat => (
              <li key={cat.ruta}>
                <button
                  className="dropdown-categorias-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 16px',
                    margin: 0,
                    color: 'inherit',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    font: 'inherit',
                  }}
                  onClick={() => {
                    setOpen(false);
                    if (onCategoriaSeleccionada) onCategoriaSeleccionada(cat);
                  }}
                >
                  {cat.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
