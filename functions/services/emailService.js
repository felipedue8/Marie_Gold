// Servicio de envío de emails usando Resend
export class EmailService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async sendVerificationEmail(email, verificationCode, userName) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verificación de Email - Marie Gold</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #cfbc4d; text-align: center; margin-bottom: 30px;">🌟 Marie Gold</h1>
            
            <h2 style="color: #333; text-align: center;">¡Hola ${userName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Gracias por registrarte en Marie Gold. Para completar tu registro y verificar tu email, 
              ingresa el siguiente código de verificación:
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #cfbc4d; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h1 style="color: #cfbc4d; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: monospace;">
                ${verificationCode}
              </h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Este código expira en 15 minutos por seguridad.<br>
              Si no solicitaste esta verificación, puedes ignorar este email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Marie Gold - Joyería Artesanal
            </p>
          </div>
        </body>
      </html>
    `;

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev', // Usar el dominio verificado de Resend
          to: [email],
          subject: '🌟 Código de verificación - Marie Gold',
          html: htmlContent
        })
      });

      if (!response.ok) {
        throw new Error(`Error sending email: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
}

// Función para generar código de verificación
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

// Función para generar token único
export function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
