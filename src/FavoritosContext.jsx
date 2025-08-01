import React, { createContext, useContext } from 'react';
import { useFavoritos } from './hooks/useFavoritos';

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const favoritos = useFavoritos();

  return (
    <FavoritosContext.Provider value={favoritos}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritosContext() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritosContext debe usarse dentro de FavoritosProvider');
  }
  return context;
}
