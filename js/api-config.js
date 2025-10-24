/**
 * Dynamic API configuration for the Together website.
 * Automatically detects whether we are on GitHub Pages or Netlify
 * and returns the correct SMS API endpoint.
 */

// Return the proper API URL based on the current environment
function getSmsApiUrl() {
  // Detect whether we are in a production environment outside Netlify
  const hostname = window.location.hostname;
  const isNetlify = hostname.includes('netlify.app') || hostname.includes('windsurf.build');
  
  if (!isNetlify) {
    // On a custom domain or GitHub Pages, use the full Netlify function URL
    return 'https://together-website.windsurf.build/.netlify/functions/send-sms';
  } else {
    // On Netlify, use the relative path
    return '/.netlify/functions/send-sms';
  }
}

// Send an SMS using the configured API (callable from anywhere in the app)
async function enviarSMS(telefono, tipoOS) {
  try {
    const apiUrl = getSmsApiUrl();
    console.log(`Sending request to: ${apiUrl}`);
    console.log(`Payload: ${JSON.stringify({phoneNumber: telefono, osType: tipoOS})}`);
    
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
    
    // Read the raw response text first
    const responseText = await response.text();
    
    // Attempt to parse it as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', responseText);
      responseData = { error: 'JSON parsing error', details: responseText };
    }
    
    // Surface extra details when the response is not successful
    if (!response.ok) {
      console.error('Server error:', responseData);
      // Attach the status code for easier diagnostics
      responseData.statusCode = response.status;
    }
    
    return responseData;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      error: 'Connection error',
      details: error.message,
      networkError: true
    };
  }
}
