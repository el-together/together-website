/**
 * Configuración dinámica de API para Together Website
 * Detecta automáticamente si estamos en GitHub Pages o Netlify
 * y proporciona la URL correcta para la API de SMS
 */

// Función que devuelve la URL correcta de la API según el entorno
function getSmsApiUrl() {
  // Detectar si estamos en un entorno de producción que no es Netlify
  const hostname = window.location.hostname;
  const isNetlify = hostname.includes('netlify.app') || hostname.includes('windsurf.build');
  
  if (!isNetlify) {
    // Si estamos en un dominio personalizado o en GitHub Pages, usar la URL completa
    // de la función en Netlify
    return 'https://together-website.windsurf.build/.netlify/functions/send-sms';
  } else {
    // Estamos en Netlify, usar la URL relativa
    return '/.netlify/functions/send-sms';
  }
}

// Función genérica para enviar SMS (puede ser usada desde cualquier parte de la app)
async function enviarSMS(telefono, tipoOS) {
  try {
    const apiUrl = getSmsApiUrl();
    console.log(`Enviando solicitud a: ${apiUrl}`);
    console.log(`Datos: ${JSON.stringify({phoneNumber: telefono, osType: tipoOS})}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: telefono,
        osType: tipoOS
      })
    });
    
    // Obtenemos el texto de la respuesta primero
    const responseText = await response.text();
    
    // Intentamos convertirlo a JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Error al parsear respuesta JSON:', responseText);
      responseData = { error: 'Error al parsear respuesta', details: responseText };
    }
    
    // Si la respuesta no fue exitosa, mostramos más detalles
    if (!response.ok) {
      console.error('Error del servidor:', responseData);
      // Agregamos el código de estado para mejor diagnóstico
      responseData.statusCode = response.status;
    }
    
    return responseData;
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    return {
      error: 'Error de conexión',
      details: error.message,
      networkError: true
    };
  }
}
