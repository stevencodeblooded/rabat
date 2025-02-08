import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <ExclamationCircleIcon className="mx-auto h-20 w-20 text-rabat-primary-500 mb-6" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Oops! The page you are looking for seems to have wandered off the map.
            Perhaps it's exploring a hidden corner of Rabat?
          </p>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="rabat-btn-primary py-3 rounded-md text-lg font-semibold"
            >
              Return to Home
            </Link>
            <Link 
              to="/map" 
              className="rabat-btn-secondary py-3 rounded-md text-lg font-semibold"
            >
              Explore Rabat's Map
            </Link>
          </div>
        </div>
        
        {/* Playful Urban Exploration Hint */}
        <div className="text-center text-gray-500 mt-6">
          <p>
            Just like in urban exploration, sometimes you might take a wrong turn. 
            But that's where the adventure begins!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;