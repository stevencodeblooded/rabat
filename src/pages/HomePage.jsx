import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LocationMarkerIcon,  // Alternative for MapIcon and MapPinIcon
  ChatIcon, 
} from "@heroicons/react/outline";

const FeatureCard = ({ icon: Icon, title, description, linkTo }) => (
  <div className="rabat-card transform transition-all duration-300 hover:scale-105 hover:shadow-rabat-medium">
    <div className="flex items-center mb-4">
      <Icon className="w-10 h-10 text-rabat-primary-500 mr-4" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link 
      to={linkTo} 
      className="text-rabat-primary-600 hover:text-rabat-primary-700 font-medium flex items-center"
    >
      Explore <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Link>
  </div>
);

const HomePage = () => {
  const features = [
    {
      icon: LocationMarkerIcon,
      title: 'CityScope',
      description: 'Interactive map of Rabat. Explore, annotate, and discover the city\'s hidden gems.',
      linkTo: '/map'
    },
    {
      icon: ChatIcon,
      title: 'Agora',
      description: 'Community forum to connect, discuss urban issues, and share local insights.',
      linkTo: '/agora'
    },
    {
      icon: LocationMarkerIcon,
      title: 'Échappées',
      description: 'Create personalized urban routes based on your interests and preferences.',
      linkTo: '/echappees'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-rabat-primary-500 to-rabat-accent-400 text-white">
        <div className="rabat-container py-20 lg:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Discover Rabat, Together
            </h1>
            <p className="text-xl mb-10 text-white/90 animate-slide-up">
              An interactive platform that transforms how you experience, understand, and engage with the urban landscape of Rabat.
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/map" 
                className="rabat-btn-primary px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Exploring
              </Link>
              <Link 
                to="/about" 
                className="rabat-btn-secondary px-8 py-3 rounded-full text-lg font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="rabat-container py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Platform Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore Rabat through collaborative mapping, community discussions, and personalized urban experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              linkTo={feature.linkTo}
            />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-rabat-primary-50 py-16 lg:py-24">
        <div className="rabat-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Join the Urban Exploration
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Whether you're a local resident, urban enthusiast, or curious visitor, 
            your perspective matters in shaping Rabat's narrative.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/auth" 
              className="rabat-btn-primary px-10 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Create Account
            </Link>
            <Link 
              to="/about" 
              className="rabat-btn-secondary px-10 py-3 rounded-full text-lg font-semibold"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;