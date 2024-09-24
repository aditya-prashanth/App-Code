// Optional: Make the WebSocket URL configurable
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:9090';

const subscribeToTopics = () => {
  let socket;

  const connectWebSocket = () => {
    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log('Connected to WebSocket server.');

      // Subscribe to the boat_positions topic that contains the JSON-encoded positions
      socket.send(JSON.stringify({
        op: 'subscribe',
        topic: 'boat_positions',
        type: 'std_msgs/String'
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.topic === "boat_positions" && data.msg) {
          const positions = JSON.parse(data.msg.data);  // Parse the JSON data into JavaScript objects
          console.log('Received data:', positions);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 5000);
    };
  };

  // Start the WebSocket connection
  connectWebSocket();

  return () => {
    if (socket) {
      socket.close();
      console.log('WebSocket connection closed manually.');
    }
  };
};

export { subscribeToTopics };
