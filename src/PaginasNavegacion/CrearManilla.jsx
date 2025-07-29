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

  // SVG base del hilo (curva simple)
  const hiloSVG = (
    <svg
      className="cuerda-svg"
      width="400"
      height="200"
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sombra */}
      <ellipse cx="200" cy="190" rx="140" ry="10" fill="#0002" />
      {/* Hilo base */}
      <path
        d="M60,120 Q200,180 340,120"
        stroke={colorHilo}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  return (
    <div className="crear-manilla-container">
      <h2 className="crear-manilla-titulo">Personaliza tu manilla</h2>
      {hiloSVG}
      <div className="selector-colores-hilo">
        <span>Color del hilo:</span>
        <div className="colores-lista">
          {COLORES_HILO.map(c => (
            <button
              key={c.valor}
              onClick={() => setColorHilo(c.valor)}
              className={colorHilo === c.valor ? 'selected' : ''}
              style={{
                border: colorHilo === c.valor ? undefined : `2px solid ${c.borde || c.valor}`,
                background: c.valor
              }}
              aria-label={`Color ${c.nombre}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
