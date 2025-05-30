const twilio = require('twilio');

// Función auxiliar para validar que las variables de entorno existen
function validarVariablesEntorno() {
  const variables = [
    { nombre: 'TWILIO_ACCOUNT_SID', valor: process.env.TWILIO_ACCOUNT_SID },
    { nombre: 'TWILIO_AUTH_TOKEN', valor: process.env.TWILIO_AUTH_TOKEN },
    { nombre: 'TWILIO_PHONE_NUMBER', valor: process.env.TWILIO_PHONE_NUMBER }
  ];
  
  const faltantes = variables.filter(v => !v.valor).map(v => v.nombre);
  
  if (faltantes.length > 0) {
    return {
      valido: false,
      mensaje: `Faltan las siguientes variables de entorno: ${faltantes.join(', ')}`
    };
  }
  
  return { valido: true };
}

exports.handler = async function(event, context) {
  // Configurar CORS para permitir tanto Netlify como GitHub Pages
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Manejar solicitudes OPTIONS para preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: headers,
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
        headers: headers,
        body: JSON.stringify({ error: 'Se requiere número de teléfono y tipo de OS' })
      };
    }

    // Validar que el tipo de OS sea válido (Android o iPhone)
    if (osType !== 'Android' && osType !== 'iPhone') {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: 'Tipo de OS no válido. Debe ser "Android" o "iPhone"' })
      };
    }

    // Validar variables de entorno antes de configurar Twilio
    const validacion = validarVariablesEntorno();
    if (!validacion.valido) {
      console.error('Error de configuración:', validacion.mensaje);
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ 
          error: 'Error de configuración', 
          details: validacion.mensaje
        })
      };
    }
    
    // Log para depuración (sin exponer valores completos)
    console.log('Configuración de Twilio:');
    console.log('- ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.substring(0, 5)}...` : 'No definido');
    console.log('- AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Presente (no mostrado por seguridad)' : 'No definido');
    console.log('- PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || 'No definido');
    
    // Configurar el cliente de Twilio con las variables de entorno
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Preparar el mensaje según el tipo de OS con formato único para distinguirlo
    const timestamp = new Date().toISOString().substring(11, 19); // Formato HH:MM:SS
    let messageBody;
    
    if (osType === 'Android') {
      messageBody = `📱 ¡Hola! Gracias por tu interés en Together. Aquí tienes el enlace para descargar la app para Android: https://bit.ly/4mVv42P \n\nEquipo Together`;
    } else {
      messageBody = `📱 ¡Hola! Gracias por tu interés en Together. Aquí tienes el enlace para descargar la app para iPhone: https://apple.co/3H35bNK \n\nEquipo Together`;
    }

    // Enviar el SMS
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'SMS enviado correctamente',
        messageId: message.sid
      })
    };
  } catch (error) {
    // Mejorar la información de error para depuración
    let errorDetail = error.message;
    let errorType = 'Desconocido';
    
    // Identificar tipos comunes de errores
    if (error.code) {
      errorType = `Twilio Error [${error.code}]`;
      
      // Errores comunes de Twilio
      if (error.code === 20404) {
        errorDetail = 'Credenciales inválidas o incorrectas de Twilio';
      } else if (error.code === 21211) {
        errorDetail = 'Número de teléfono inválido o en formato incorrecto';
      } else if (error.code === 21608) {
        errorDetail = 'El número de teléfono de origen no está verificado o permitido';
      } else if (error.code === 21610) {
        errorDetail = 'Cuenta de Twilio sin saldo suficiente';
      }
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = 'Error de red';
    }
    
    console.error(`Error al enviar SMS [${errorType}]:`, error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ 
        error: 'Error al enviar el SMS',
        errorType: errorType,
        details: errorDetail,
        rawError: error.toString()
      })
    };
  }
};
