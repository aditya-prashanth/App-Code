import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWebSocket } from '../contexts/WebSocketContext';
import L from 'leaflet';

// Random color generator for polyline
const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MapComponent = () => {
  const { socket } = useWebSocket();
  const [boatTrails, setBoatTrails] = useState({});
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleData = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.topic === "/boat_positions") {
          const updates = JSON.parse(message.msg.data);
          updates.forEach(update => {
            const { boat_id, latitude, longitude } = update;
            setBoatTrails(prevTrails => {
              const newTrails = { ...prevTrails };
              if (!newTrails[boat_id]) {
                newTrails[boat_id] = [];
              }
              newTrails[boat_id].push([latitude, longitude]);
              return newTrails;
            });
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    if (socket) {
      socket.addEventListener('message', handleData);
    }

    return () => {
      if (socket) {
        socket.removeEventListener('message', handleData);
      }
    };
  }, [socket]);

  // Handle map clicks to add custom markers
  const handleMapClick = (event) => {
    const newMarker = {
      id: Date.now(),
      position: event.latlng,
      draggable: true,
      description: "Custom Point"
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  // Handle marker drag end to update position
  const handleDragEnd = (event, index) => {
    const { lat, lng } = event.target.getLatLng();
    setMarkers(prev =>
      prev.map((marker, idx) => idx === index ? { ...marker, position: L.latLng(lat, lng) } : marker)
    );
  };

  return (
    <>
      <button onClick={() => setBoatTrails({})}>
        Clear Trails
      </button>
      <MapContainer
        center={[0, 0]}
        zoom={3}
        style={{ height: '100vh', width: '100%' }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(boatTrails).map(([boatId, trail]) => (
          <Polyline key={boatId} positions={trail} color={randomColor()} /> 
        ))}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.position}
            draggable={true}
            eventHandlers={{
              dragend: (event) => handleDragEnd(event, index)
            }}
          >
            <Popup>{marker.description}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default MapComponent;
