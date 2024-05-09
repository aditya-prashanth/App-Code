const WebSocket = require('ws');

let ws;
let reconnectionAttempts = 0;

const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:9090');

  ws.onopen = () => {
    console.log('Connected to ROSBridge WebSocket');
    subscribeToTopics();
    reconnectionAttempts = 0;
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // Handle the boat_positions data as JSON formatted data now
      if (data.topic === 'boat_positions' && data.msg) {
        const positions = JSON.parse(data.msg.data); // Correctly parse the JSON string
        positions.forEach(pos => {
          console.log(`Received Boat Position: ID ${pos.boat_id}, Lat ${pos.latitude}, Lon ${pos.longitude}`);
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket closed. Attempting to reconnect...');
    if (reconnectionAttempts < 5) {
      setTimeout(connectWebSocket, 2000);
      reconnectionAttempts++;
    } else {
      console.log('Max reconnection attempts reached.');
    }
  };
};

const subscribeToTopics = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log('WebSocket is not open. Cannot subscribe to topics.');
    return;
  }
  console.log('Subscribing to topics on WebSocket');

  // Subscribe to the corrected topic with the appropriate data format
  ws.send(JSON.stringify({
    op: 'subscribe',
    topic: 'boat_positions',
    type: 'std_msgs/String'  // Correct type for the JSON string data
  }));
};

module.exports = { connectWebSocket };
