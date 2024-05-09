// Assuming you have some URL to connect to the WebSocket server
const WEBSOCKET_URL = 'ws://localhost:9090';

const subscribeToTopics = () => {
  const socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    console.log('Connected to WebSocket server.');

    // Subscribe to the boat_positions topic that contains the JSON-encoded positions
    socket.send(JSON.stringify({
      op: 'subscribe',
      topic: 'boat_positions',
      type: 'std_msgs/String'
    }));

    // You can subscribe to other topics in a similar manner
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.topic === "boat_positions" && data.msg) {
      const positions = JSON.parse(data.msg.data);  // Parse the JSON data into JavaScript objects
      console.log('Received data:', positions);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  // Optionally return the socket if you need to manage it outside of this function
  return socket;
};

export { subscribeToTopics };
