const twilio = require('twilio');

// Helper to make sure required environment variables exist
function validateEnvVariables() {
  const variables = [
    { name: 'TWILIO_ACCOUNT_SID', value: process.env.TWILIO_ACCOUNT_SID },
    { name: 'TWILIO_AUTH_TOKEN', value: process.env.TWILIO_AUTH_TOKEN },
    { name: 'TWILIO_PHONE_NUMBER', value: process.env.TWILIO_PHONE_NUMBER }
  ];
  
  const missing = variables.filter(v => !v.value).map(v => v.name);
  
  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing environment variables: ${missing.join(', ')}`
    };
  }
  
  return { valid: true };
}

exports.handler = async function(event, context) {
  // Configure CORS to allow both Netlify and GitHub Pages
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { phoneNumber, osType } = data;

    // Validate required fields
    if (!phoneNumber || !osType) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: 'Phone number and OS type are required' })
      };
    }

    // Validate OS type (must be Android or iPhone)
    if (osType !== 'Android' && osType !== 'iPhone') {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: 'Invalid OS type. It must be "Android" or "iPhone"' })
      };
    }

    // Ensure environment variables are present before configuring Twilio
    const validation = validateEnvVariables();
    if (!validation.valid) {
      console.error('Configuration error:', validation.message);
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ 
          error: 'Configuration error', 
          details: validation.message
        })
      };
    }
    
    // Debug logs without exposing full values
    console.log('Twilio configuration:');
    console.log('- ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.substring(0, 5)}...` : 'Not set');
    console.log('- AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Present (hidden for security)' : 'Not set');
    console.log('- PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || 'Not set');
    
    // Configure the Twilio client with the environment variables
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Prepare the message based on OS so we can distinguish deliveries
    let messageBody;
    
    if (osType === 'Android') {
      messageBody = `📱 Hi! Thanks for your interest in Together. Download the Android app here: https://bit.ly/4mVv42P\n\n- Together team`;
    } else {
      messageBody = `📱 Hi! Thanks for your interest in Together. Get the iPhone app here: https://apps.apple.com/es/app/together-daily-to-do-planner/id6460859044\n\n- Together team`;
    }

    // Send the SMS
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
        message: 'SMS sent successfully',
        messageId: message.sid
      })
    };
  } catch (error) {
    // Provide richer error information for debugging
    let errorDetail = error.message;
    let errorType = 'Unknown';
    
    // Identify common error types
    if (error.code) {
      errorType = `Twilio Error [${error.code}]`;
      
      // Map frequent Twilio errors to clearer descriptions
      if (error.code === 20404) {
        errorDetail = 'Invalid Twilio credentials';
      } else if (error.code === 21211) {
        errorDetail = 'Invalid or incorrectly formatted phone number';
      } else if (error.code === 21608) {
        errorDetail = 'Origin phone number is not verified or allowed';
      } else if (error.code === 21610) {
        errorDetail = 'Twilio account does not have enough balance';
      }
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = 'Network error';
    }
    
    console.error(`Error sending SMS [${errorType}]:`, error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ 
        error: 'Error sending SMS',
        errorType: errorType,
        details: errorDetail,
        rawError: error.toString()
      })
    };
  }
};
