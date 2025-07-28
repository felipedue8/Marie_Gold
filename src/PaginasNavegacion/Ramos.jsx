import React from 'react';
import { categoriasMenu } from './categoriasMenu';
import { MenuCategorias } from './MenuCategorias';
import { ProductosPaginados } from './ProductosPaginados';

export function Ramos() {
  // Filtra solo las categorías de manillas
  const categoriasGeneral = categoriasMenu.filter(cat => cat.prefijoId.startsWith('4.'));
  // Elige la primera como predeterminada
  const [categoria, setCategoria] = React.useState(categoriasGeneral[0]);

  return (
    <>
      <MenuCategorias categorias={categoriasGeneral} onCategoriaSeleccionada={setCategoria} />
      <ProductosPaginados prefijoId={categoria.prefijoId} titulo={categoria.nombre} />
    </>
  );
}