import React, { useEffect } from 'react';
import MapComponent from './components/MapComponent';
import FleetControls from './components/FleetControls';
import { useWebSocket } from './contexts/WebSocketContext';
import { subscribeToTopics } from './components/usvService';

const App = () => {
  const { socket, boatPositions } = useWebSocket();

  // Function to send commands via the WebSocket
  const sendCommand = (topic, message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify({
        op: 'publish',
        topic: topic,
        msg: message,
      });
      socket.send(msg);
      console.log(`Command sent to topic ${topic}:`, message);
    } else {
      console.error('WebSocket is not open. Unable to send command.');
    }
  };

  useEffect(() => {
    // Ensure subscribeToTopics is called only when the WebSocket is open and ready
    if (socket && socket.readyState === WebSocket.OPEN) {
      subscribeToTopics();
    }

    const handleSocketOpen = () => {
      console.log('WebSocket opened, subscribing to topics.');
      subscribeToTopics(); // Subscribe when WebSocket is fully open
    };

    // Handle when WebSocket opens, in case it wasn't open immediately on mount
    if (socket) {
      socket.addEventListener('open', handleSocketOpen);
    }

    return () => {
      if (socket) {
        socket.removeEventListener('open', handleSocketOpen); // Clean up listener on unmount
      }
    };
  }, [socket]);

  const handleFleetSizeChange = (size) => {
    console.log(`Fleet size set to: ${size}`);
    sendCommand('boat_count', { data: size.toString() });
  };

  return (
    <div className="App">
      <FleetControls
        onFleetSizeChange={handleFleetSizeChange}
      />
      <MapComponent />
    </div>
  );
};

export default App;
