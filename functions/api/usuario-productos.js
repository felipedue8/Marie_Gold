export async function onRequestPost(context) {
  const db = context.env.DB;
  const { usuario_id, producto_id, tipo } = await context.request.json(); // tipo: 'carrito' o 'favorito'

  if (!usuario_id || !producto_id || !tipo) {
    return new Response('Faltan datos', { status: 400 });
  }

  try {
    // Verificar si ya existe
    const { results } = await db.prepare(
      'SELECT * FROM usuario_productos WHERE usuario_id = ? AND producto_id = ? AND tipo = ?'
    ).bind(usuario_id, producto_id, tipo).all();

    if (results.length > 0) {
      // Si ya existe, actualizar cantidad (solo para carrito)
      if (tipo === 'carrito') {
        await db.prepare(
          'UPDATE usuario_productos SET cantidad = cantidad + 1 WHERE usuario_id = ? AND producto_id = ? AND tipo = ?'
        ).bind(usuario_id, producto_id, tipo).run();
      }
    } else {
      // Si no existe, crear nuevo
      const cantidad = tipo === 'carrito' ? 1 : 0;
      await db.prepare(
        'INSERT INTO usuario_productos (usuario_id, producto_id, tipo, cantidad) VALUES (?, ?, ?, ?)'
      ).bind(usuario_id, producto_id, tipo, cantidad).run();
    }

    return new Response('Agregado correctamente', { status: 200 });
  } catch (e) {
    console.log('Error al agregar producto:', e.message);
    return new Response('Error al agregar producto', { status: 500 });
  }
}

export async function onRequestGet(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const usuario_id = url.searchParams.get('usuario_id');
  const tipo = url.searchParams.get('tipo');

  if (!usuario_id || !tipo) {
    return new Response('Faltan parámetros', { status: 400 });
  }

  try {
    const { results } = await db.prepare(
      'SELECT * FROM usuario_productos WHERE usuario_id = ? AND tipo = ?'
    ).bind(usuario_id, tipo).all();

    return Response.json(results);
  } catch (e) {
    console.log('Error al obtener productos:', e.message);
    return new Response('Error al obtener productos', { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const db = context.env.DB;
  const { usuario_id, producto_id, tipo } = await context.request.json();

  if (!usuario_id || !producto_id || !tipo) {
    return new Response('Faltan datos', { status: 400 });
  }

  try {
    await db.prepare(
      'DELETE FROM usuario_productos WHERE usuario_id = ? AND producto_id = ? AND tipo = ?'
    ).bind(usuario_id, producto_id, tipo).run();

    return new Response('Eliminado correctamente', { status: 200 });
  } catch (e) {
    console.log('Error al eliminar producto:', e.message);
    return new Response('Error al eliminar producto', { status: 500 });
  }
}
