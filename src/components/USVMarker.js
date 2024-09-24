import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import usvIconImage from './assets/usv-icon.png'; // Ensure correct import

const usvIcon = new L.Icon({
  iconUrl: usvIconImage,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const USVMarker = ({ usvData }) => {
  return (
    usvData.map((usv) => (
      <Marker key={usv.id} position={[usv.latitude, usv.longitude]} icon={usvIcon}>
        <Popup>
          <strong>Latitude:</strong> {usv.latitude}<br />
          <strong>Longitude:</strong> {usv.longitude}<br />
        </Popup>
      </Marker>
    ))
  );
};

export default USVMarker;
