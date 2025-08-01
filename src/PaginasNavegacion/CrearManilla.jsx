import React, { useState } from 'react';
import './CrearManilla.css';

// Aquí irá el nuevo código para el creador de manillas

// Colores disponibles para el hilo
const COLORES_HILO = [
  { nombre: 'Rojo', valor: '#e74c3c' },
  { nombre: 'Azul', valor: '#3498db' },
  { nombre: 'Verde', valor: '#27ae60' },
  { nombre: 'Negro', valor: '#222' },
  { nombre: 'Rosa', valor: '#e84393' },
  { nombre: 'Amarillo', valor: '#f9ca24' },
  { nombre: 'Morado', valor: '#8e44ad' },
  { nombre: 'Blanco', valor: '#fff', borde: '#aaa' }
];

export function CrearManilla() {
  const [colorHilo, setColorHilo] = useState(COLORES_HILO[0].valor);

  // SVG editable de la manilla (Manilla Final.svg), pequeño y con color dinámico
  const hiloSVG = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '24px 0' }}>
      <svg
        className="cuerda-svg"
        width="550"
        height="500"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        style={{ maxWidth: '100vw', maxHeight: '22000px', display: 'block' }}
      >
        <path d="M59.25595,249.397241c-79.020088,90.922062-80.010737,147.635876,14.942876,187.348021q-36.715163-2.011174,446.706867,0c103.154876-23.148688,94.047708-93.674011,0-187.348021" transform="translate(7.269511-1.67758)" fill="none" stroke={colorHilo} strokeWidth="8" border="solid black 1px"  />
        <path d="" fill="none" stroke={colorHilo} strokeWidth="1.2" />
      </svg>
    </div>
  );

  return (
    <div className="crear-manilla-container">
      <h2 className="crear-manilla-titulo">Personaliza tu manilla</h2>
      {hiloSVG}
      <div className="selector-colores-hilo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
        <span style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 16 }}>Color del hilo:</span>
        <div className="colores-lista" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {COLORES_HILO.map(c => (
            <button
              key={c.valor}
              onClick={() => setColorHilo(c.valor)}
              className={colorHilo === c.valor ? 'selected color-btn' : 'color-btn'}
              style={{ 
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: colorHilo === c.valor ? '4px solid #333' : `2px solid ${c.borde || c.valor}`,
                background: c.valor,
                boxShadow: colorHilo === c.valor ? '0 0 12px #888' : undefined,
                transition: 'border 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              aria-label={`Color ${c.nombre}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
