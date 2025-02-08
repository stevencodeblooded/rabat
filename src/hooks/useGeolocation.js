import { useState, useEffect } from 'react';

export const useGeolocation = (watch = false, highAccuracy = false) => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      },
      error: null
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      coordinates: { lat: null, lng: null },
      error: {
        code: error.code,
        message: error.message
      }
    });
  };

  useEffect(() => {
    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported"
      });
      return;
    }

    const options = {
      enableHighAccuracy: highAccuracy,
      maximumAge: 30000,
      timeout: 27000
    };

    // If watch is true, use watchPosition, otherwise use getCurrentPosition
    const watchId = watch 
      ? navigator.geolocation.watchPosition(onSuccess, onError, options)
      : navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Cleanup function
    return () => {
      if (watch && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch, highAccuracy]);

  return location;
};