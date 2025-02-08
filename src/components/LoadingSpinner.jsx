import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
        <div className="text-center">
          <div 
            className={`${sizeClasses.large} border-4 border-rabat-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
          />
          <p className="text-xl text-rabat-primary-600 font-semibold">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      <div 
        className={`${sizeClasses[size]} border-4 border-rabat-primary-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className="text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

// Suspend component for lazy loading
export const Suspend = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingSpinner fullScreen />}>
      {children}
    </React.Suspense>
  );
};

export default LoadingSpinner;