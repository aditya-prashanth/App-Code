import React, { useEffect } from 'react';
import MapComponent from './components/MapComponent';
import FleetControls from './components/FleetControls';
import { useWebSocket } from './contexts/WebSocketContext';
import { subscribeToTopics } from './components/usvService'; // Adjust path as necessary

const App = () => {
  const { sendCommand, socket } = useWebSocket();

  useEffect(() => {
    // Ensure subscribeToTopics is called only when the WebSocket is open and ready
    if (socket && socket.readyState === WebSocket.OPEN) {
      subscribeToTopics();
    }
  }, [socket]); // Dependency on the socket ensures this runs only when socket state changes

  const handleFleetSizeChange = (size) => {
    console.log(`Fleet size set to: ${size}`);
    sendCommand('boat_count', { data: size.toString() }); // Assuming 'std_msgs/String' as the ROS message type
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
