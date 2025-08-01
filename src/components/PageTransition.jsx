import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Componente simple que envuelve cada página con animación
export function AnimatedPage({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para activar la animación después del montaje
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`animate-in ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        minHeight: '50vh'
      }}
    >
      {children}
    </div>
  );
}

// Loading indicator suave para transiciones
export function PageLoader({ show }) {
  if (!show) return null;

  return (
    <div className="page-loading">
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f0f0f0',
          borderTop: '3px solid #FFD700',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
    </div>
  );
}

// Hook para manejar transiciones entre rutas
export function useRouteTransition() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== prevLocation.pathname) {
      setIsLoading(true);
      
      // Simular un pequeño delay para la transición
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevLocation(location);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);

  return { isLoading, currentLocation: location };
}
