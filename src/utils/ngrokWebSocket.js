// ngrok WebSocket Connection Helper
// This utility helps establish WebSocket connections with ngrok URLs

export const createNgrokWebSocket = (baseUrl, recipientId, token, appointmentId) => {
  return new Promise((resolve, reject) => {
    // Clean and prepare the URL
    const wsBaseUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://').replace(/\/$/, '');
    
    // Multiple URL formats to try with ngrok
    const urlVariants = [
      `${wsBaseUrl}/chat/ws/${recipientId}?token=${token}&appointment_id=${appointmentId}`,
      `${wsBaseUrl}/chat/ws/${recipientId}?token=${encodeURIComponent(token)}&appointment_id=${appointmentId}`,
      `${wsBaseUrl}/chat/ws/${recipientId}?appointment_id=${appointmentId}&token=${token}`,
    ];

    let currentAttempt = 0;
    
    const attemptConnection = () => {
      if (currentAttempt >= urlVariants.length) {
        reject(new Error('All connection attempts failed'));
        return;
      }
      
      const url = urlVariants[currentAttempt];
      console.log(`🔄 Attempt ${currentAttempt + 1}/${urlVariants.length}: ${url}`);
      
      // For ngrok URLs, first make a preflight request to handle browser warnings
      if (url.includes('ngrok')) {
        fetch(baseUrl, {
          method: 'HEAD',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': '*/*'
          }
        }).catch(() => {
          // Ignore preflight errors
        });
      }
      
      const ws = new WebSocket(url);
      
      const timeout = setTimeout(() => {
        ws.close();
        currentAttempt++;
        setTimeout(attemptConnection, 1000);
      }, 5000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        console.log('✅ WebSocket connected successfully!');
        resolve(ws);
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`❌ Attempt ${currentAttempt + 1} failed:`, error);
        currentAttempt++;
        setTimeout(attemptConnection, 1000);
      };
    };
    
    attemptConnection();
  });
};

// Test ngrok WebSocket connection
export const testNgrokConnection = async (baseUrl, recipientId, token, appointmentId) => {
  try {
    console.log('🧪 Testing ngrok WebSocket connection...');
    
    const ws = await createNgrokWebSocket(baseUrl, recipientId, token, appointmentId);
    
    // Set up message handlers
    ws.onmessage = (event) => {
      console.log('📥 Received:', event.data);
    };
    
    ws.onclose = () => {
      console.log('🔌 Connection closed');
    };
    
    // Send test message
    const testMessage = {
      recipient: recipientId,
      message: "Connection test successful!",
      appointment_id: appointmentId,
      timestamp: new Date().toISOString()
    };
    
    ws.send(JSON.stringify(testMessage));
    console.log('📤 Test message sent');
    
    return ws;
  } catch (error) {
    console.error('🚫 Connection test failed:', error);
    throw error;
  }
};
