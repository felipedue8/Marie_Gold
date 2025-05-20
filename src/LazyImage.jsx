import React, { useState } from 'react';

export function LazyImage({ src, alt, ...props }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ minHeight: 200, background: '#eee', position: 'relative' }}>
      {!loaded && <div style={{ position: 'absolute', width: '100%', height: '100%', background: '#eee' }} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
        {...props}
      />
    </div>
  );
}