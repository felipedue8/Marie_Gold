import React from 'react';
import { categoriasMenu } from './categoriasMenu';
import { MenuCategorias } from './MenuCategorias';
import { ProductosPaginados } from './ProductosPaginados';

export function Tobilleras({ sidebarOpen }) {
  const categoriasGeneral = categoriasMenu.filter(cat => cat.prefijoId.startsWith('6.'));
  const [categoria, setCategoria] = React.useState(categoriasGeneral[0]);

  return (
    <>
      <MenuCategorias categorias={categoriasGeneral} onCategoriaSeleccionada={setCategoria} sidebarOpen={sidebarOpen} />
      <ProductosPaginados prefijoId={categoria.prefijoId} titulo={categoria.nombre} />
    </>
  );
}
