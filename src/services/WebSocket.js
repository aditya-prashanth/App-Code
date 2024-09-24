const WebSocket = require('ws');

let ws;
let reconnectionAttempts = 0;
const maxReconnectionAttempts = 5;  // Configurable reconnection attempts

const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:9090');

  ws.onopen = () => {
    console.log('Connected to ROSBridge WebSocket');
    subscribeToTopics();
    reconnectionAttempts = 0;  // Reset reconnection attempts upon successful connection
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Handle the boat_positions topic
      if (data.topic === 'boat_positions' && data.msg) {
        const positions = JSON.parse(data.msg.data);  // Parse the JSON string containing positions
        positions.forEach(pos => {
          console.log(`Received Boat Position: ID ${pos.boat_id}, Lat ${pos.latitude}, Lon ${pos.longitude}`);
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error.message || error);  // Log the error message for better context
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
    // Attempt reconnection if under the maximum allowed attempts
    if (reconnectionAttempts < maxReconnectionAttempts) {
      reconnectionAttempts++;
      console.log(`Reconnection attempt ${reconnectionAttempts}...`);
      setTimeout(connectWebSocket, 2000);  // Try to reconnect after 2 seconds
    } else {
      console.log('Max reconnection attempts reached. Giving up.');
    }
  };
};

const subscribeToTopics = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log('WebSocket is not open. Cannot subscribe to topics.');
    return;
  }
  console.log('Subscribing to boat_positions topic');

  // Subscribe to the correct topic
  ws.send(JSON.stringify({
    op: 'subscribe',
    topic: 'boat_positions',
    type: 'std_msgs/String'  // Correct type for receiving JSON string data
  }));
};

module.exports = { connectWebSocket };
