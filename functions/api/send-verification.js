import { GmailService, generateVerificationCode, generateToken } from '../services/gmailService.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  const { email } = await context.request.json();

  if (!email) {
    return new Response(JSON.stringify({
      error: 'Email requerido',
      message: 'Debes proporcionar un email valido.'
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({
      error: 'Email invalido',
      message: 'El formato del email no es valido.'
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Verificar si ya existe un usuario con este email
    const { results: existingUsers } = await db.prepare('SELECT id FROM usuarios WHERE email = ?')
      .bind(email).all();
    
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({
        error: 'Email ya registrado',
        message: 'Este email ya tiene una cuenta registrada. Si olvidaste tu contraseña, usa la opción de recuperación.'
      }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar si ya hay una verificación pendiente (últimos 1 minuto para desarrollo, 5 minutos en producción)
    const waitTimeMinutes = process.env.NODE_ENV === 'production' ? 5 : 1;
    const waitTimeAgo = new Date(Date.now() - waitTimeMinutes * 60 * 1000).toISOString();
    const { results: recentVerifications } = await db.prepare(
      'SELECT id FROM email_verification WHERE email = ? AND created_at > ? AND verified = FALSE'
    ).bind(email, waitTimeAgo).all();

    if (recentVerifications.length > 0) {
      return new Response(JSON.stringify({
        error: 'Código enviado recientemente',
        message: `Ya se envió un código de verificación recientemente. Espera ${waitTimeMinutes} minuto(s) antes de solicitar otro.`,
        waitTime: `${waitTimeMinutes} minuto(s)`
      }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generar código y token
    const verificationCode = generateVerificationCode();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutos

    // Guardar en base de datos
    await db.prepare(
      'INSERT INTO email_verification (email, token, expires_at) VALUES (?, ?, ?)'
    ).bind(email, verificationCode, expiresAt).run();

    // Enviar email usando Gmail API (100% gratuito)
    if (context.env.GMAIL_CLIENT_ID && context.env.GMAIL_CLIENT_SECRET && context.env.GMAIL_REFRESH_TOKEN) {
      try {
        const gmailService = new GmailService(
          context.env.GMAIL_CLIENT_ID,
          context.env.GMAIL_CLIENT_SECRET, 
          context.env.GMAIL_REFRESH_TOKEN
        );
        await gmailService.sendVerificationEmail(email, verificationCode, 'Usuario');
        
        return new Response(JSON.stringify({ 
          message: 'Codigo de verificacion enviado por email',
          email: email 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (emailError) {
        console.error('Error enviando email con Gmail, usando modo desarrollo:', emailError);
        // Si falla el email real, usar modo desarrollo
        console.log(`Código de verificación para ${email}: ${verificationCode}`);
        return new Response(JSON.stringify({ 
          error: 'Error en envio',
          message: 'Hubo un problema enviando el email. El codigo aparece en la consola del servidor.',
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
        message: 'Codigo de verificacion generado (Gmail no configurado - revisa la consola del servidor)',
        email: email,
        code: verificationCode // Solo para desarrollo
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error en verificacion de email:', error);
    return new Response(JSON.stringify({
      error: 'Error',
      message: 'Ocurrio un error inesperado. Intenta de nuevo.'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
