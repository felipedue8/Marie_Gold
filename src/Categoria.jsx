import React from 'react';
import { AnimatedPage } from './components/PageTransition';

export function Categoria({ nombre }) {
  return (
    <AnimatedPage>
      <div>
        <h2>{nombre}</h2>
        <p>Proximamente"{nombre}".</p>
      </div>
    </AnimatedPage>
  );
}