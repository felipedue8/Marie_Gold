export async function onRequestGet(context) {
  const db = context.env.DB;
  const producto_id = context.params.producto_id;

  try {
    const { results } = await db.prepare('SELECT * FROM comentarios WHERE producto_id = ? ORDER BY fecha DESC')
      .bind(producto_id).all();
    
    return Response.json(results);
  } catch (e) {
    console.log('Error al obtener comentarios:', e.message);
    return new Response('Error al obtener comentarios', { status: 500 });
  }
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  const producto_id = context.params.producto_id;
  const { usuario_id, nombre_usuario, comentario } = await context.request.json();

  if (!usuario_id || !nombre_usuario || !comentario) {
    return new Response('Faltan datos', { status: 400 });
  }

  try {
    await db.prepare('INSERT INTO comentarios (producto_id, usuario_id, nombre_usuario, comentario) VALUES (?, ?, ?, ?)')
      .bind(producto_id, usuario_id, nombre_usuario, comentario).run();
    
    return new Response('Comentario agregado', { status: 201 });
  } catch (e) {
    console.log('Error al agregar comentario:', e.message);
    return new Response('Error al agregar comentario', { status: 500 });
  }
}
