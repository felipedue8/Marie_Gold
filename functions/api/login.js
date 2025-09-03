import bcrypt from 'bcryptjs';

export async function onRequest(context) {
  const db = context.env.DB;
  const { email, password } = await context.request.json();

  if (!email || !password) {
    return new Response('Faltan datos', { status: 400 });
  }

  const { results } = await db.prepare('SELECT * FROM usuarios WHERE email = ?').bind(email).all();
  if (results.length === 0) return new Response('Usuario no encontrado', { status: 404 });

  const usuario = results[0];
  
  // Verificar que el email esté verificado
  if (!usuario.email_verified) {
    return new Response(JSON.stringify({
      error: "Cuenta no verificada",
      message: "Debes verificar tu cuenta antes de iniciar sesión. Revisa tu email.",
      needsVerification: true
    }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const match = await bcrypt.compare(password, usuario.password);
  if (match) {
    return Response.json({ success: true, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  }
  return new Response('Contraseña incorrecta', { status: 401 });
}
