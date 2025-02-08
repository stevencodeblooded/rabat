// src/components/Map/CityScope.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CityScope = () => {
  const [markers, setMarkers] = useState([]);
  const rabatCoordinates = [34.0209, -6.8241]; // Rabat coordinates

  useEffect(() => {
    // Fetch initial markers or user contributions
    const fetchMarkers = async () => {
      try {
        // Replace with actual API call
        const dummyMarkers = [
          { 
            id: 1, 
            position: [34.0209, -6.8241], 
            title: 'City Center', 
            description: 'Central point of Rabat' 
          },
          // Add more markers
        ];
        setMarkers(dummyMarkers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    fetchMarkers();
  }, []);

  const handleMapClick = (e) => {
    // Logic to add new markers
    const newMarker = {
      id: Date.now(),
      position: [e.latlng.lat, e.latlng.lng],
      title: 'New Contribution',
      description: 'User-added marker'
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  return (
    <div className="h-screen w-full">
      <MapContainer 
        center={rabatCoordinates} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        onclick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div>
                <h3 className="font-bold">{marker.title}</h3>
                <p>{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CityScope;