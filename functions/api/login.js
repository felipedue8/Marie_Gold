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
  const match = await bcrypt.compare(password, usuario.password_hash);
  if (match) {
    return Response.json({ success: true, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  }
  return new Response('Contraseña incorrecta', { status: 401 });
}
