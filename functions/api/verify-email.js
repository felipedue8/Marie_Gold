export async function onRequestPost(context) {
  const db = context.env.DB;
  const { email, code } = await context.request.json();

  if (!email || !code) {
    return new Response('Email y código requeridos', { status: 400 });
  }

  try {
    // Buscar verificación válida
    const { results } = await db.prepare(`
      SELECT id, expires_at, verified 
      FROM email_verification 
      WHERE email = ? AND token = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).bind(email, code).all();

    if (results.length === 0) {
      return new Response('Código inválido', { status: 400 });
    }

    const verification = results[0];

    // Verificar si ya fue usado
    if (verification.verified) {
      return new Response('Este código ya fue utilizado', { status: 400 });
    }

    // Verificar si expiró
    const now = new Date();
    const expiresAt = new Date(verification.expires_at);
    if (now > expiresAt) {
      return new Response('El código ha expirado', { status: 400 });
    }

    // NO marcar como verificado aquí - se marcará en el registro
    // Solo validar que el código es correcto
    return new Response(JSON.stringify({ 
      message: 'Código válido',
      verified: true 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error verificando código:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
