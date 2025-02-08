import React, { useState, useEffect } from "react";
import {
  UserIcon,
  MailIcon,
  PhotographIcon,
  PencilIcon,
  LocationMarkerIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";
import { notificationService } from "../services/notificationService";

const PREDEFINED_INTERESTS = [
  { id: "urban-planning", name: "Urban Planning" },
  { id: "architecture", name: "Architecture" },
  { id: "sustainability", name: "Sustainability" },
  { id: "local-culture", name: "Local Culture" },
  { id: "community-development", name: "Community Development" },
  { id: "transportation", name: "Transportation" },
  { id: "environment", name: "Environment" },
  { id: "heritage", name: "Heritage Preservation" },
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    interests: [], // This will now be an array of objects
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [contributions, setContributions] = useState([]);

  // Fetch user profile and contributions
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileResponse, contributionsResponse] = await Promise.all([
          apiClient.get('/profile'),
          apiClient.get('/contributions/user') // Updated endpoint
        ]);
  
        setProfileData(profileResponse.data);
        setContributions(contributionsResponse.data);
      } catch (error) {
        notificationService.error('Failed to load profile data');
      }
    };
  
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = { ...profileData };
      if (selectedImage) {
        payload.profileImage = selectedImage;
      }

      const response = await apiClient.put("/profile", payload);
      setProfileData(response.data);
      setIsEditing(false);
      notificationService.success("Profile updated successfully");
    } catch (error) {
      notificationService.error("Failed to update profile");
    }
  };

  const handleAddInterest = (interest) => {
    // Check if interest is already added
    const isAlreadyAdded = profileData.interests.some(
      (i) => i.id === interest.id
    );

    if (!isAlreadyAdded) {
      setProfileData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interest) => interest.id !== interestToRemove.id
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    selectedImage ||
                    profileData.profileImage ||
                    "../assets/avatar.png"
                  }
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover mb-4 border-4 border-rabat-primary-100"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-rabat-primary-500 text-white rounded-full p-2 cursor-pointer">
                    <PhotographIcon className="h-6 w-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="text-xl font-bold text-center w-full border rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-xl font-bold">{profileData.name}</h2>
              )}

              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  placeholder="Add your location"
                  className="text-gray-600 mt-2 text-center w-full border rounded px-2 py-1"
                />
              ) : (
                <p className="text-gray-600 mt-2 flex items-center">
                  <LocationMarkerIcon className="h-5 w-5 mr-2 text-rabat-primary-500" />
                  {profileData.location || "Location not set"}
                </p>
              )}

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-rabat-primary-500 text-white px-4 py-2 rounded-md hover:bg-rabat-primary-600 flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 space-y-4">
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-rabat-primary-500 text-white px-4 py-2 rounded-md hover:bg-rabat-primary-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3 text-rabat-primary-500" />
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border rounded p-2"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600">
                  {profileData.bio || "No bio available"}
                </p>
              )}
            </div>

            {/* Interests Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <UserIcon className="h-6 w-6 mr-3 text-rabat-primary-500" />
                Interests
              </h3>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PREDEFINED_INTERESTS.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => handleAddInterest(interest)}
                        className={`
            px-3 py-1 rounded-full text-sm 
            ${
              profileData.interests.some((i) => i.id === interest.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }
          `}
                      >
                        {interest.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest) => (
                      <div
                        key={interest.id}
                        className="bg-rabat-primary-100 text-rabat-primary-700 px-3 py-1 rounded-full flex items-center"
                      >
                        {interest.name}
                        <button
                          onClick={() => removeInterest(interest)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.length > 0 ? (
                    profileData.interests.map((interest) => (
                      <span
                        key={interest.id}
                        className="bg-rabat-primary-100 text-rabat-primary-700 px-3 py-1 rounded-full"
                      >
                        {interest.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No interests added</p>
                  )}
                </div>
              )}
            </div>

            {/* Contributions Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MailIcon className="h-6 w-6 mr-3 text-rabat-primary-500" />
                My Contributions
              </h3>
              {contributions.length > 0 ? (
                <div className="space-y-4">
                  {contributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="bg-gray-100 p-4 rounded-lg"
                    >
                      <h4 className="font-semibold">{contribution.title}</h4>
                      <p className="text-gray-600">
                        {contribution.description}
                      </p>
                      <div className="text-sm text-gray-500 mt-2">
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No contributions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
