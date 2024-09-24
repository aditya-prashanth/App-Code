import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

const FleetControls = () => {
  const [fleetSize, setFleetSize] = useState('');
  const [ros, setRos] = useState(null);

  useEffect(() => {
    // Setup the ROS connection when the component mounts
    const rosInstance = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    rosInstance.on('connection', () => {
      console.log('Connected to websocket server.');
    });

    rosInstance.on('error', (error) => {
      console.log('Error connecting to websocket server: ', error);
    });

    rosInstance.on('close', () => {
      console.log('Connection to websocket server closed.');
    });

    setRos(rosInstance);

    // Cleanup ROS connection when the component unmounts
    return () => {
      if (rosInstance) {
        rosInstance.close();
        console.log('ROS connection closed.');
      }
    };
  }, []);

  // Function to publish fleet size to ROS
  const handleFleetSizeSubmit = async (e) => {
    e.preventDefault();
    const fleetSizeInt = parseInt(fleetSize);
    if (fleetSizeInt < 1) {
      alert('Please enter a valid fleet size.');
      return;
    }

    // Ensure ROS is connected before publishing
    if (ros) {
      // Create a new ROS Topic
      const topic = new ROSLIB.Topic({
        ros: ros,
        name: 'boat_count',
        messageType: 'std_msgs/Int32'  // Use 'Int32' since we're sending a number
      });

      // Create the message
      const message = new ROSLIB.Message({
        data: fleetSizeInt
      });

      // Publish the message
      topic.publish(message);

      alert('Fleet size updated successfully.');
    } else {
      console.error('ROS is not connected.');
    }
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

