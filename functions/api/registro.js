import bcrypt from 'bcryptjs';

export async function onRequest(context) {
  const db = context.env.DB;
  const { nombre, email, password } = await context.request.json();

  // Log para depuración
  console.log('Datos recibidos en registro:', { nombre, email, password });

  if (!nombre || !email || !password) {
    console.log('Registro fallido: faltan datos');
    return new Response('Faltan datos', { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  try {
    await db.prepare('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)')
      .bind(nombre, email, password_hash).run();
    console.log('Registro exitoso:', email);
    return new Response('Usuario registrado', { status: 201 });
  } catch (e) {
    console.log('Error al registrar:', e.message);
    return new Response('Email ya registrado o error de base de datos', { status: 409 });
  }
}
