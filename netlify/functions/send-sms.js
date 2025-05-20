const twilio = require('twilio');

exports.handler = async function(event, context) {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    // Parsear el cuerpo de la solicitud
    const data = JSON.parse(event.body);
    const { phoneNumber, osType } = data;

    // Validar que se proporcionaron los datos necesarios
    if (!phoneNumber || !osType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Se requiere número de teléfono y tipo de OS' })
      };
    }

    // Validar que el tipo de OS sea válido (Android o iPhone)
    if (osType !== 'Android' && osType !== 'iPhone') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Tipo de OS no válido. Debe ser "Android" o "iPhone"' })
      };
    }

    // Configurar el cliente de Twilio con las variables de entorno
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Preparar el mensaje según el tipo de OS con formato único para distinguirlo
    const timestamp = new Date().toISOString().substring(11, 19); // Formato HH:MM:SS
    let messageBody;
    
    if (osType === 'Android') {
      messageBody = `[TOGETHER-LANDING-${timestamp}] 📱 Enlace para descargar la app de Together para ANDROID: https://play.google.com/store/apps/details?id=com.together.app`;
    } else {
      messageBody = `[TOGETHER-LANDING-${timestamp}] 📱 Enlace para descargar la app de Together para iPHONE: https://apps.apple.com/app/together/id123456789`;
    }

    // Enviar el SMS
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'SMS enviado correctamente',
        messageId: message.sid
      })
    };
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al enviar el SMS', 
        details: error.message 
      })
    };
  }
};
