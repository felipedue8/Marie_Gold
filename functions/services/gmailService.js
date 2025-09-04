// Servicio de envío de emails usando Gmail API (100% gratuito)
export class GmailService {
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Obtener access token fresco usando refresh token
  async getAccessToken() {
    try {
      // Si tenemos token y no ha expirado, lo usamos
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      // Obtener nuevo access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error(`Error getting access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Los tokens suelen durar 1 hora, guardamos tiempo de expiración
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 min de buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error obteniendo access token:', error);
      throw error;
    }
  }

  // Codificar mensaje para Gmail API con soporte UTF-8 completo
  base64urlEscape(str) {
    return str.replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=/g, '');
  }

  base64urlEncode(str) {
    // Asegurar codificación UTF-8 correcta
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return this.base64urlEscape(btoa(binary));
  }

  // Crear mensaje RFC2822 compatible con UTF-8 mejorado
  createMessage(to, subject, htmlContent) {
    const boundary = 'boundary_' + Math.random().toString(36).substring(2);
    
    // Codificar el subject correctamente para UTF-8
    const utf8Bytes = new TextEncoder().encode(subject);
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binaryString += String.fromCharCode(utf8Bytes[i]);
    }
    const encodedSubject = btoa(binaryString);
    
    const message = [
      'MIME-Version: 1.0',
      `To: ${to}`,
      'From: "Marie Gold" <felipedue80@gmail.com>',
      'Reply-To: mariegold@gmail.com',
      'Sender: mariegold@gmail.com',
      `Subject: =?UTF-8?B?${encodedSubject}?=`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      'Content-Transfer-Encoding: 8bit',
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      htmlContent,
      `--${boundary}--`
    ].join('\n');

    return this.base64urlEncode(message);
  }

  async sendVerificationEmail(email, verificationCode, userName) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verificacion de Email - mariegold</title>
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

    try {
      console.log('🔄 Obteniendo token de acceso...');
      const accessToken = await this.getAccessToken();
      
      console.log('📧 Creando mensaje de email...');
      const encodedMessage = this.createMessage(
        email,
        '✨ Codigo de verificacion - mariegold',
        htmlContent
      );

      console.log('📤 Enviando email via Gmail API...');
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
        console.error('❌ Error de Gmail API:', errorData);
        throw new Error(`Gmail API error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('✅ Email enviado exitosamente con ID:', result.id);
      
      // Obtener información del perfil para debugging
      try {
        const profileResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          console.log('📋 Cuenta Gmail utilizada:', profile.emailAddress);
        }
      } catch (e) {
        console.log('ℹ️ No se pudo obtener info del perfil Gmail');
      }
      
      return result;

    } catch (error) {
      console.error('❌ Error enviando email con Gmail:', error);
      throw error;
    }
  }
}

// Funciones auxiliares
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
