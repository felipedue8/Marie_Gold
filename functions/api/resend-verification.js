export async function onRequest(context) {
  const db = context.env.DB;
  const { email } = await context.request.json();

  if (!email) {
    return new Response('Email requerido', { status: 400 });
  }

  try {
    // Verificar si el usuario existe y no está verificado
    const { results } = await db.prepare('SELECT * FROM usuarios WHERE email = ?')
      .bind(email).all();
    
    if (results.length === 0) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    const usuario = results[0];
    
    if (usuario.verificado === 1) {
      return new Response('Usuario ya está verificado', { status: 400 });
    }

    // Generar nuevo token si no existe
    let token = usuario.token_verificacion;
    if (!token) {
      token = crypto.randomUUID();
      await db.prepare('UPDATE usuarios SET token_verificacion = ? WHERE email = ?')
        .bind(token, email).run();
    }

    // Enviar por Telegram
    try {
      await fetch(`${new URL(context.request.url).origin}/api/send-telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          email: email,
          nombre: usuario.nombre
        })
      });
      
      return Response.json({ 
        success: true,
        message: 'Link de verificación reenviado por Telegram' 
      });
    } catch (telegramError) {
      console.log('Error enviando por Telegram:', telegramError);
      return new Response('Error reenviando verificación', { status: 500 });
    }

  } catch (e) {
    console.log('Error al reenviar verificación:', e.message);
    return new Response('Error al reenviar verificación', { status: 500 });
  }
}
