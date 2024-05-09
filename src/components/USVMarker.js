import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const usvIcon = new L.Icon({
  iconUrl: require('./assets/usv-icon.png'), // Updated path
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const USVMarker = ({ usvData }) => {
  return (
    <>
      {usvData.map((usv, index) => (
        <Marker key={index} position={[usv.latitude, usv.longitude]} icon={usvIcon}>
          <Popup>
            <strong>Latitude:</strong> {usv.latitude}<br />
            <strong>Longitude:</strong> {usv.longitude}<br />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default USVMarker;