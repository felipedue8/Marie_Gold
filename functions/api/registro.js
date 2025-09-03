import bcrypt from 'bcryptjs';

export async function onRequest(context) {
  const db = context.env.DB;
  const { nombre, email, password, verificationCode } = await context.request.json();

  // Log para depuración
  console.log('Datos recibidos en registro:', { nombre, email, password: password ? '[OCULTO]' : null, verificationCode });

  if (!nombre || !email || !password) {
    console.log('Registro fallido: faltan datos');
    return new Response('Faltan datos requeridos', { status: 400 });
  }

  if (!verificationCode) {
    return new Response('Código de verificación requerido', { status: 400 });
  }

  try {
    // Verificar que el email fue verificado con el código correcto
    const { results: verifications } = await db.prepare(`
      SELECT id, verified, expires_at 
      FROM email_verification 
      WHERE email = ? AND token = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).bind(email, verificationCode).all();

    if (verifications.length === 0) {
      return new Response('Código de verificación inválido', { status: 400 });
    }

    const verification = verifications[0];

    if (!verification.verified) {
      return new Response('Email no verificado. Usa el código que recibiste por email.', { status: 400 });
    }

    // Verificar si el código no ha expirado (aunque ya fue verificado)
    const now = new Date();
    const expiresAt = new Date(verification.expires_at);
    if (now > expiresAt) {
      return new Response('El código de verificación ha expirado', { status: 400 });
    }

    // Verificar si ya existe un usuario con este email
    const { results: existingUsers } = await db.prepare('SELECT id FROM usuarios WHERE email = ?')
      .bind(email).all();
    
    if (existingUsers.length > 0) {
      return new Response('Este email ya está registrado', { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Registrar usuario con email verificado
    await db.prepare('INSERT INTO usuarios (nombre, email, password, email_verified) VALUES (?, ?, ?, TRUE)')
      .bind(nombre, email, password_hash).run();

    // Limpiar verificaciones usadas para este email
    await db.prepare('DELETE FROM email_verification WHERE email = ? AND verified = TRUE')
      .bind(email).run();

    console.log('Registro exitoso con email verificado:', email);
    return new Response(JSON.stringify({ 
      message: 'Usuario registrado exitosamente',
      emailVerified: true 
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.log('Error al registrar:', e.message);
    return new Response('Error en el registro', { status: 500 });
  }
}
