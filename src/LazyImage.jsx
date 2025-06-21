import React, { useState, useEffect, useRef } from 'react';

export function LazyImage({ src, alt, style = {}, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight !== 0) {
      setLoaded(true); // Imagen ya está cargada desde caché
    }
  }, [src]);

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
        ref={imgRef}
        src={error ? '/fallback.jpg' : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          display: 'block',
        }}
        {...props}
      />

      {!loaded && !error && (
        <span
          style={{
            position: 'absolute',
            color: '#999',
            fontSize: '0.8rem',
          }}
        >
          Cargando...
        </span>
      )}
    </div>
  );
}
