export async function onRequest(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><title>Error de Verificación</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #d9534f;">❌ Token de verificación requerido</h2>
        <p>El link de verificación es inválido.</p>
        <a href="/" style="background: #FFD700; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al inicio</a>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 400
    });
  }

  try {
    // Buscar usuario con este token
    const { results } = await db.prepare('SELECT * FROM usuarios WHERE token_verificacion = ?')
      .bind(token).all();
    
    if (results.length === 0) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Token Inválido</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #d9534f;">❌ Token de verificación inválido</h2>
          <p>Este link de verificación no es válido o ya fue usado.</p>
          <a href="/" style="background: #FFD700; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al inicio</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 404
      });
    }

    const usuario = results[0];
    
    // Si ya está verificado
    if (usuario.verificado === 1) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Ya Verificado</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #f0ad4e;">⚠️ Cuenta ya verificada</h2>
          <p>Tu cuenta <strong>${usuario.email}</strong> ya estaba verificada.</p>
          <a href="/login" style="background: #FFD700; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 200
      });
    }

    // Verificar usuario
    await db.prepare('UPDATE usuarios SET verificado = 1, token_verificacion = NULL WHERE id = ?')
      .bind(usuario.id).run();

    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><title>Cuenta Verificada</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #5cb85c;">✅ ¡Cuenta verificada exitosamente!</h2>
        <p>Tu cuenta <strong>${usuario.email}</strong> ha sido verificada.</p>
        <p>Ahora puedes iniciar sesión y usar todas las funciones.</p>
        <a href="/login" style="background: #FFD700; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    });

  } catch (e) {
    console.log('Error al verificar:', e.message);
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #d9534f;">❌ Error al verificar cuenta</h2>
        <p>Ocurrió un error al verificar tu cuenta. Intenta nuevamente.</p>
        <a href="/" style="background: #FFD700; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al inicio</a>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    });
  }
}
