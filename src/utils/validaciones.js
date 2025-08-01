// Validaciones para productos
export function validarProducto(producto) {
  const errores = [];

  if (!producto) {
    errores.push('El producto no puede estar vacío');
    return errores;
  }

  if (!producto.id || producto.id === '') {
    errores.push('El producto debe tener un ID válido');
  }

  if (!producto.titulo || producto.titulo.trim() === '' || producto.titulo.trim() === ' ') {
    errores.push('El producto debe tener un título válido');
  }

  if (!producto.descripcion || producto.descripcion.trim() === '') {
    errores.push('El producto debe tener una descripción válida');
  }

  if (!producto.precio || producto.precio === '' || isNaN(parseFloat(producto.precio.replace(/[^\d.-]/g, '')))) {
    errores.push('El producto debe tener un precio válido');
  }

  if (!producto.imagen || producto.imagen.trim() === '') {
    errores.push('El producto debe tener una imagen válida');
  }

  if (!producto.alt || producto.alt.trim() === '') {
    errores.push('El producto debe tener un texto alternativo para la imagen');
  }

  return errores;
}

// Validar lista completa de productos
export function validarProductos(productos) {
  const productosValidos = [];
  const productosInvalidos = [];

  productos.forEach((producto, index) => {
    const errores = validarProducto(producto);
    if (errores.length === 0) {
      productosValidos.push(producto);
    } else {
      productosInvalidos.push({
        index,
        producto,
        errores
      });
    }
  });

  return {
    validos: productosValidos,
    invalidos: productosInvalidos,
    totalValidos: productosValidos.length,
    totalInvalidos: productosInvalidos.length
  };
}

// Validaciones para búsqueda
export function validarBusqueda(termino) {
  if (!termino || typeof termino !== 'string') {
    return { valido: false, mensaje: 'El término de búsqueda debe ser una cadena de texto' };
  }

  const terminoLimpio = termino.trim();
  
  if (terminoLimpio.length === 0) {
    return { valido: false, mensaje: 'El término de búsqueda no puede estar vacío' };
  }

  if (terminoLimpio.length < 1) {
    return { valido: false, mensaje: 'El término de búsqueda debe tener al menos 1 carácter' };
  }

  if (terminoLimpio.length > 100) {
    return { valido: false, mensaje: 'El término de búsqueda es demasiado largo' };
  }

  return { valido: true, termino: terminoLimpio };
}

// Validaciones para carrito
export function validarProductoCarrito(producto) {
  if (!producto || typeof producto !== 'object') {
    return { valido: false, mensaje: 'El producto debe ser un objeto válido' };
  }

  if (!producto.id) {
    return { valido: false, mensaje: 'El producto debe tener un ID' };
  }

  if (!producto.nombre || producto.nombre.trim() === '') {
    return { valido: false, mensaje: 'El producto debe tener un nombre' };
  }

  return { valido: true };
}
