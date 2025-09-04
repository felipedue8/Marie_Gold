// Servicio de envío de emails usando Gmail API (100% Gratuito)
export class EmailService {
  constructor(clientId, clientSecret, refreshToken, userEmail) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.userEmail = userEmail;
  }

  async getAccessToken() {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  async sendVerificationEmail(email, verificationCode, userName) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verificación de Email - mariegold</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header con logo prominente -->
            <div style="text-align: center; background: linear-gradient(135deg, #cfbc4d, #e6d670); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">✨ mariegold ✨</h1>
              <p style="color: white; margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Joyería Artesanal</p>
            </div>
            
            <h2 style="color: #333; text-align: center;">¡Hola ${userName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Gracias por registrarte en <strong style="color: #cfbc4d;">mariegold</strong>. Para completar tu registro y verificar tu email, 
              ingresa el siguiente codigo de verificacion:
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #cfbc4d; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h1 style="color: #cfbc4d; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: monospace;">
                ${verificationCode}
              </h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Este codigo expira en 15 minutos por seguridad.<br>
              Si no solicitaste esta verificacion, puedes ignorar este email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #cfbc4d; font-size: 18px; font-weight: bold; margin: 10px 0;">mariegold</p>
              <p style="color: #999; font-size: 12px; margin: 0;">© 2025 mariegold - Joyeria Artesanal</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Crear el mensaje en formato RFC2822
    const subject = 'Codigo de verificacion - mariegold';
    const message = [
      `To: ${email}`,
      `From: "mariegold" <${this.userEmail}>`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      htmlContent
    ].join('\r\n');

    // Convertir a base64url (requerido por Gmail API) - TU MÉTODO QUE FUNCIONA
    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gmail API error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('✅ Email enviado exitosamente con Gmail API:', result.id);
      return { success: true, messageId: result.id };

    } catch (error) {
      console.error('❌ Error enviando email con Gmail API:', error);
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
