import { EmailService } from '../services/emailService.js';

export async function onRequestPost(context) {
  try {
    if (!context.env.RESEND_API_KEY) {
      return new Response('API Key de Resend no configurado', { status: 500 });
    }

    const emailService = new EmailService(context.env.RESEND_API_KEY);
    
    // Enviar email de prueba
    await emailService.sendVerificationEmail(
      'felipedue80@gmail.com', 
      '123456', 
      'Felipe'
    );

    return new Response(JSON.stringify({ 
      message: 'Email de prueba enviado exitosamente a felipedue80@gmail.com',
      status: 'success'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error enviando email de prueba:', error);
    return new Response(JSON.stringify({ 
      message: 'Error enviando email',
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
