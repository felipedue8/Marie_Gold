import React from 'react';

export function Categoria({ nombre }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>Proximamente"{nombre}".</p>
    </div>
  );
}