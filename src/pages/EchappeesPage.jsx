import React, { useState, useEffect, useRef } from 'react';
import { 
  LocationMarkerIcon, 
  StarIcon, 
  AdjustmentsIcon, 
  RefreshIcon 
} from '@heroicons/react/outline';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import apiClient from '../services/apiClient';
import { notificationService } from '../services/notificationService';

const RouteThemeCard = ({ theme, isSelected, onSelect }) => (
  <div 
    onClick={() => onSelect(theme)}
    className={`
      cursor-pointer p-4 rounded-lg shadow-md transition-all duration-300
      ${isSelected 
        ? 'bg-rabat-primary-500 text-white' 
        : 'bg-white text-gray-800 hover:bg-gray-100'
      }
    `}
  >
    <div className="flex items-center space-x-4">
      <div className={`
        p-3 rounded-full 
        ${isSelected 
          ? 'bg-white/20' 
          : 'bg-rabat-primary-100 text-rabat-primary-600'
        }
      `}>
        <StarIcon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{theme.name}</h3>
        <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
          {theme.description}
        </p>
      </div>
    </div>
  </div>
);

const RouteDetailsCard = ({ route }) => (
  <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-800">Route Details</h3>
      <span className="text-sm text-rabat-primary-500">
        {route.distance} km | {route.estimatedTime}
      </span>
    </div>
    <div className="space-y-2">
      {route.points.map((point, index) => (
        <div 
          key={index} 
          className="flex items-center space-x-3 bg-gray-100 p-3 rounded-md"
        >
          <LocationMarkerIcon className="h-6 w-6 text-rabat-primary-500" />
          <div>
            <h4 className="font-semibold">{point.name}</h4>
            <p className="text-sm text-gray-600">{point.description}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="flex space-x-4">
      <button className="flex-1 bg-rabat-primary-500 text-white py-2 rounded-md hover:bg-rabat-primary-600">
        Start Navigation
      </button>
      <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300">
        Save Route
      </button>
    </div>
  </div>
);

const EchappeesPage = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const geolocation = useGeolocation();

  const routeThemes = [
    {
      id: 'history',
      name: 'Historical Journey',
      description: 'Explore Rabat\'s rich historical sites',
      icon: StarIcon
    },
    {
      id: 'culture',
      name: 'Cultural Immersion',
      description: 'Discover local art, markets, and traditions',
      icon: StarIcon
    },
    {
      id: 'nature',
      name: 'Urban Nature',
      description: 'Parks, gardens, and green spaces',
      icon: StarIcon
    },
    {
      id: 'gastronomy',
      name: 'Culinary Trail',
      description: 'Local cuisine and food experiences',
      icon: StarIcon
    }
  ];

  const generateRoute = async () => {
    if (!selectedTheme || !geolocation.loaded) {
      notificationService.error('Please select a theme and enable location');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/routes/generate', {
        theme: selectedTheme.id,
        startLocation: {
          lat: geolocation.coordinates.lat,
          lng: geolocation.coordinates.lng
        }
      });

      setRoute(response.data);
      notificationService.success('Route generated successfully!');
    } catch (error) {
      notificationService.error('Failed to generate route');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* Themes Selection */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <LocationMarkerIcon className="h-8 w-8 mr-3 text-rabat-primary-500" />
              Échappées: Urban Exploration
            </h2>
            <p className="text-gray-600 mb-6">
              Choose a theme and we'll craft a personalized route through Rabat's unique landscapes.
            </p>

            <div className="space-y-4">
              {routeThemes.map((theme) => (
                <RouteThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme?.id === theme.id}
                  onSelect={setSelectedTheme}
                />
              ))}
            </div>

            <button 
              onClick={generateRoute}
              disabled={!selectedTheme || isLoading}
              className={`
                w-full mt-6 py-3 rounded-md flex items-center justify-center
                ${selectedTheme 
                  ? 'bg-rabat-primary-500 text-white hover:bg-rabat-primary-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <RefreshIcon className="h-6 w-6 animate-spin" />
              ) : (
                'Generate Route'
              )}
            </button>
          </div>
        </div>

        {/* Map View */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
          <MapContainer 
            center={[34.0209, -6.8241]} 
            zoom={13} 
            scrollWheelZoom={true} 
            className="h-[600px] w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* User's Current Location */}
            {geolocation.loaded && !geolocation.error && (
              <Marker 
                position={[
                  geolocation.coordinates.lat, 
                  geolocation.coordinates.lng
                ]}
              >
                <Popup>Your Current Location</Popup>
              </Marker>
            )}

            {/* Generated Route */}
            {route && (
              <>
                {route.points.map((point, index) => (
                  <Marker 
                    key={index} 
                    position={[point.lat, point.lng]}
                  >
                    <Popup>
                      <h3 className="font-bold">{point.name}</h3>
                      <p>{point.description}</p>
                    </Popup>
                  </Marker>
                ))}
                <Polyline 
                  positions={route.points.map(point => [point.lat, point.lng])}
                  color="blue" 
                  weight={5} 
                  opacity={0.7} 
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* Route Details */}
        {route && (
          <div className="md:col-span-3">
            <RouteDetailsCard route={route} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EchappeesPage;