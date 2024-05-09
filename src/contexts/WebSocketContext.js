import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [boatPositions, setBoatPositions] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:9090');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      // Subscribe to boat_positions when the connection is opened
      ws.send(JSON.stringify({
        op: 'subscribe',
        topic: 'boat_positions',
        type: 'std_msgs/String'
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.topic === "/boat_positions") {
          const positions = JSON.parse(message.msg.data); // Parse the array of positions
          setBoatPositions(positions); // Update state with new positions
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, boatPositions }}>
      {children}
    </WebSocketContext.Provider>
  );
};
