export async function onRequest(context) {
  // Obtener configuración desde variables de entorno
  const TELEGRAM_TOKEN = context.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = context.env.TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.log('⚠️ Variables de Telegram no configuradas');
    return new Response('Bot de Telegram no configurado', { status: 500 });
  }

  const { token, email, nombre } = await context.request.json();

  if (!token || !email) {
    return new Response('Token y email requeridos', { status: 400 });
  }

  // Función para enviar mensaje por Telegram
  const sendTelegramMessage = async (message) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error enviando mensaje de Telegram:', error);
      return false;
    }
  };

  // URL de verificación
  const verificationUrl = `${new URL(context.request.url).origin}/api/verificar?token=${token}`;
  
  // Mensaje para Telegram
  const message = `
🔐 <b>Nueva verificación de cuenta - Marie Gold</b>

👤 <b>Usuario:</b> ${nombre || 'No especificado'}
📧 <b>Email:</b> ${email}
🔗 <b>Link de verificación:</b>
${verificationUrl}

⏰ <i>Enviado el ${new Date().toLocaleString('es-ES')}</i>
  `.trim();

  // Enviar mensaje por Telegram
  const enviado = await sendTelegramMessage(message);
  
  if (enviado) {
    console.log(`✅ Link de verificación enviado por Telegram para: ${email}`);
    return Response.json({ 
      success: true, 
      message: 'Link de verificación enviado por Telegram' 
    });
  } else {
    console.log(`❌ Error enviando link por Telegram para: ${email}`);
    return new Response('Error enviando verificación por Telegram', { status: 500 });
  }
}
