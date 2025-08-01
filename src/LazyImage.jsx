import React, { useState, useCallback } from 'react';

export function LazyImage({ src, alt, style = {}, fallbackSrc = '/vite.svg', ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '15px',
        backgroundColor: '#f0f0f0',
        ...style,
      }}
    >
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          display: 'block',
        }}
        {...props}
      />

      {!loaded && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: '#999',
            fontSize: '0.8rem',
          }}
        >
          Cargando...
        </div>
      )}
    </div>
  );
}
