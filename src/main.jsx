import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.jsx';

function NoviaDayMessage() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 30000);
    return () => clearTimeout(timer);
  }, []);
  if (!show) return null;
  return (
    <div className="novia-day-overlay">
      <div className="novia-day-message">
        <h2>¡Feliz Día de la Novia!</h2>
        <p style={{marginBottom: '18px'}}>Señorita dueña de esta página, en verdad feliz día de la novia. Felicidades por ser tan excelente novia, en verdad siento que saqué la lotería porque tener la suerte de conocerte y que fueras mi primera pareja es algo que no creo que les pase a muchas personas. En verdad gracias por estos años y espero poder seguir a tu lado.</p>
        <button className="novia-day-btn" onClick={() => setShow(false)}>
          Ir a la página principal
        </button>
        <div className="flores-animadas">
          {[...Array(8)].map((_, i) => (
            <span key={i} className={`flor flor${i+1}`}>🌸</span>
          ))}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NoviaDayMessage />
    <App />
  </StrictMode>
);
