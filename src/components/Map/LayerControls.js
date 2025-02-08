import React, { useState } from 'react';

const LayerControls = ({ onLayerToggle }) => {
  const [activeLayers, setActiveLayers] = useState({
    traffic: false,
    publicTransport: false,
    userContributions: true,
  });

  const toggleLayer = (layerName) => {
    const newState = {
      ...activeLayers,
      [layerName]: !activeLayers[layerName]
    };
    setActiveLayers(newState);
    onLayerToggle(newState);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold mb-2">Map Layers</h3>
      {Object.entries(activeLayers).map(([layer, isActive]) => (
        <div key={layer} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={layer}
            checked={isActive}
            onChange={() => toggleLayer(layer)}
            className="mr-2"
          />
          <label htmlFor={layer} className="capitalize">
            {layer.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </label>
        </div>
      ))}
    </div>
  );
};

export default LayerControls;