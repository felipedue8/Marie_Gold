import { EmailService, generateVerificationCode, generateToken } from '../services/emailService.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  const { email } = await context.request.json();

  if (!email) {
    return new Response('Email requerido', { status: 400 });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response('Formato de email inválido', { status: 400 });
  }

  try {
    // Verificar si ya existe un usuario con este email
    const { results: existingUsers } = await db.prepare('SELECT id FROM usuarios WHERE email = ?')
      .bind(email).all();
    
    if (existingUsers.length > 0) {
      return new Response('Este email ya está registrado', { status: 409 });
    }

    // Verificar si ya hay una verificación pendiente (últimos 5 minutos para evitar spam)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { results: recentVerifications } = await db.prepare(
      'SELECT id FROM email_verification WHERE email = ? AND created_at > ? AND verified = FALSE'
    ).bind(email, fiveMinutesAgo).all();

    if (recentVerifications.length > 0) {
      return new Response('Ya se envió un código recientemente. Espera 5 minutos.', { status: 429 });
    }

    // Generar código y token
    const verificationCode = generateVerificationCode();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutos

    // Guardar en base de datos
    await db.prepare(
      'INSERT INTO email_verification (email, token, expires_at) VALUES (?, ?, ?)'
    ).bind(email, verificationCode, expiresAt).run();

    // Enviar email (solo si tienes configurado RESEND_API_KEY)
    if (context.env.RESEND_API_KEY) {
      try {
        const emailService = new EmailService(context.env.RESEND_API_KEY);
        await emailService.sendVerificationEmail(email, verificationCode, 'Usuario');
        
        return new Response(JSON.stringify({ 
          message: 'Código de verificación enviado por email',
          email: email 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (emailError) {
        console.error('Error enviando email real, usando modo desarrollo:', emailError);
        // Si falla el email real, usar modo desarrollo
        console.log(`Código de verificación para ${email}: ${verificationCode}`);
        return new Response(JSON.stringify({ 
          message: 'Código de verificación generado (error en envío - revisa consola)',
          email: email,
          code: verificationCode // Solo para desarrollo
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Para desarrollo - devolver el código (NO hacer esto en producción)
      console.log(`Código de verificación para ${email}: ${verificationCode}`);
      return new Response(JSON.stringify({ 
        message: 'Código de verificación generado (revisa la consola del servidor)',
        email: email,
        code: verificationCode // Solo para desarrollo
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error en verificación de email:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
