import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import {
  PlusIcon,
  XIcon,
  ViewListIcon,
  FilterIcon,
  CogIcon,
  UserGroupIcon,
  GlobeIcon,
} from "@heroicons/react/outline";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notificationService";
import apiClient from "../services/apiClient";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Contribution Form Component
const ContributionForm = ({ position, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      notificationService.error("Please fill in all fields");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      latitude: position.lat,
      longitude: position.lng,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl max-w-xs w-full">
      <h3 className="text-xl font-semibold mb-4">Add New Contribution</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contribution Title"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your observation"
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="general">General</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="culture">Culture</option>
          <option value="environment">Environment</option>
        </select>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-rabat-primary-500 text-white py-2 rounded-md hover:bg-rabat-primary-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Add Marker Component
const AddMarkerComponent = ({ onAddMarker }) => {
  const [isAdding, setIsAdding] = useState(false);
  const map = useMapEvents({
    click: (e) => {
      if (isAdding) {
        onAddMarker(e.latlng);
        setIsAdding(false);
      }
    },
  });

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
      <button
        onClick={() => setIsAdding(!isAdding)}
        className={`p-2 rounded-full shadow-lg ${
          isAdding
            ? "bg-red-500 text-white"
            : "bg-white text-gray-800 hover:bg-gray-100"
        }`}
        title={isAdding ? "Cancel Adding Marker" : "Add New Marker"}
      >
        {isAdding ? (
          <XIcon className="h-6 w-6" />
        ) : (
          <PlusIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

// Contribution Details Modal
const ContributionDetailsModal = ({ contribution, onClose }) => {
  if (!contribution) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{contribution.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          by {contribution.user.name}
        </p>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-4">
          {contribution.category}
        </span>
        <p className="text-gray-700 mb-4">{contribution.description}</p>
        <div className="text-sm text-gray-500">
          {new Date(contribution.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// Main MapPage Component
const MapPage = () => {
  const [contributions, setContributions] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [mapCenter, setMapCenter] = useState([34.0209, -6.8241]); // Rabat coordinates
  const [layers, setLayers] = useState({
    all: true,
    general: true,
    infrastructure: true,
    culture: true,
    environment: true,
  });

  const { user } = useAuth();
  const geolocation = useGeolocation();

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await apiClient.get("/contributions");
        const validContributions = response.data.map((contribution) => ({
          ...contribution,
          latitude: contribution.location.coordinates[1],
          longitude: contribution.location.coordinates[0],
        }));
        setContributions(validContributions);
      } catch (error) {
        console.error("Failed to fetch contributions", error);
        notificationService.error("Unable to load contributions");
      }
    };

    fetchContributions();
  }, []);

  useEffect(() => {
    if (geolocation.loaded && !geolocation.error) {
      setMapCenter([geolocation.coordinates.lat, geolocation.coordinates.lng]);
    }
  }, [geolocation]);

  const toggleLayer = (layerName) => {
    if (layerName === "all") {
      const newValue = !layers.all;
      setLayers({
        all: newValue,
        general: newValue,
        infrastructure: newValue,
        culture: newValue,
        environment: newValue,
      });
    } else {
      setLayers((prev) => ({
        ...prev,
        [layerName]: !prev[layerName],
        all: false,
      }));
    }
  };

  const handleAddMarker = (position) => {
    if (!user) {
      notificationService.error("Please log in to add a contribution");
      return;
    }
    setNewMarkerPosition(position);
  };

  const submitContribution = async (contributionData) => {
    try {
      console.log("Submitting contribution:", contributionData);

      const response = await apiClient.post("/contributions", contributionData);

      console.log("Contribution response:", response.data);

      if (
        response.data &&
        response.data.location &&
        response.data.location.coordinates
      ) {
        // Ensure the coordinates are in the correct order for Leaflet (lat, lng)
        const newContribution = {
          ...response.data,
          latitude: response.data.location.coordinates[1],
          longitude: response.data.location.coordinates[0],
        };

        setContributions((prev) => [...prev, newContribution]);
        setNewMarkerPosition(null);
        notificationService.success("Contribution added successfully");
      } else {
        throw new Error("Invalid contribution data");
      }
    } catch (error) {
      console.error("Full error details:", error.response || error);

      const errorMessage =
        error.response?.data?.message || "Failed to submit contribution";
      console.error("Error Message:", errorMessage);

      notificationService.error(errorMessage);
    }
  };

  const cancelAddMarker = () => {
    setNewMarkerPosition(null);
  };

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {geolocation.loaded && !geolocation.error && (
          <Marker
            position={[
              geolocation.coordinates.lat,
              geolocation.coordinates.lng,
            ]}
            icon={L.divIcon({
              className: "custom-div-icon",
              html: `<div style='background-color:blue;' class='marker-pin'></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
          >
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        {contributions
          .filter((contribution) => layers.all || layers[contribution.category])
          .map((contribution) => (
            <Marker
              key={contribution._id}
              position={[contribution.latitude, contribution.longitude]}
            >
              <Popup>
                <div className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4">
                    <h3 className="font-bold text-xl mb-2 text-gray-800 border-b pb-2">
                      {contribution.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 italic">
                      by {contribution.user.name}
                    </p>
                    <span className="inline-block bg-rabat-primary-500 text-gray-200 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-3">
                      {contribution.category}
                    </span>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {contribution.description.slice(0, 100)}
                      {contribution.description.length > 100 && (
                        <span
                          className="text-rabat-primary-600 hover:text-rabat-primary-800 cursor-pointer font-medium ml-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedContribution(contribution);
                          }}
                        >
                          ... Read more
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-rabat-primary-500 text-right">
                    <span className="text-xs text-gray-200">
                      Added on{" "}
                      {new Date(contribution.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        <div className="absolute top-20 left-3 z-[1000] bg-white shadow-lg rounded-lg p-2">
          <div className="grid grid-cols-2 gap-2">
            {["all", "general", "infrastructure", "culture", "environment"].map(
              (layer) => (
                <button
                  key={layer}
                  onClick={() => toggleLayer(layer)}
                  className={`p-2 rounded-full ${
                    layers[layer]
                      ? "bg-rabat-primary-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  title={`Toggle ${
                    layer.charAt(0).toUpperCase() + layer.slice(1)
                  } Layer`}
                >
                  {layer === "all" ? (
                    <ViewListIcon className="h-6 w-6" />
                  ) : layer === "general" ? (
                    <FilterIcon className="h-6 w-6" />
                  ) : layer === "infrastructure" ? (
                    <CogIcon className="h-6 w-6" />
                  ) : layer === "culture" ? (
                    <UserGroupIcon className="h-6 w-6" />
                  ) : (
                    <GlobeIcon className="h-6 w-6" />
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {user && <AddMarkerComponent onAddMarker={handleAddMarker} />}

        {newMarkerPosition && (
          <Marker position={newMarkerPosition}>
            <Popup>
              <ContributionForm
                position={newMarkerPosition}
                onSubmit={submitContribution}
                onCancel={cancelAddMarker}
              />
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {selectedContribution && (
        <ContributionDetailsModal
          contribution={selectedContribution}
          onClose={() => setSelectedContribution(null)}
        />
      )}
    </div>
  );
};

export default MapPage;
