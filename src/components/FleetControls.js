import React, { useState } from 'react';
import ROSLIB from 'roslib';

const FleetControls = () => {
  const [fleetSize, setFleetSize] = useState('');

  // Setup the ROS connection
  const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

  // Function to publish fleet size to ROS
  const handleFleetSizeSubmit = async (e) => {
    e.preventDefault();
    const fleetSizeInt = parseInt(fleetSize);
    if (fleetSizeInt < 1) {
      alert('Please enter a valid fleet size.');
      return;
    }
    
    // Create a new ROS Topic
    const topic = new ROSLIB.Topic({
      ros: ros,
      name: 'boat_count',
      messageType: 'std_msgs/String'
    });

    // Create the message
    const message = new ROSLIB.Message({
      data: fleetSize.toString()
    });

    // Publish the message
    topic.publish(message);

    alert('Fleet size updated successfully.');
  };

  return (
    <div className="fleet-controls">
      <form onSubmit={handleFleetSizeSubmit}>
        <label>
          Fleet Size:
          <input
            type="number"
            value={fleetSize}
            onChange={(e) => setFleetSize(e.target.value)}
            min="1"
            required
          />
        </label>
        <button type="submit">Update Fleet Size</button>
      </form>
    </div>
  );
};

export default FleetControls;
