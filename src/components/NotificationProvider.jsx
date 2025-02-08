import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Notification Types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Icons for different notification types
const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.SUCCESS]: CheckCircleIcon,
  [NOTIFICATION_TYPES.ERROR]: XCircleIcon,
  [NOTIFICATION_TYPES.WARNING]: ExclamationCircleIcon,
  [NOTIFICATION_TYPES.INFO]: InformationCircleIcon
};

// Color classes for different notification types
const NOTIFICATION_COLORS = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: 'text-green-400',
  },
  [NOTIFICATION_TYPES.ERROR]: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: 'text-red-400',
  },
  [NOTIFICATION_TYPES.WARNING]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: 'text-yellow-400',
  },
  [NOTIFICATION_TYPES.INFO]: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: 'text-blue-400',
  }
};

// Notification Context for global usage
export const NotificationContext = React.createContext();

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
    const id = Date.now();
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ 
      addNotification, 
      removeNotification,
      TYPES: NOTIFICATION_TYPES 
    }}>
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Hook for using notifications
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Container Component
const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem = ({ notification, onClose }) => {
  const { type, message } = notification;
  const Icon = NOTIFICATION_ICONS[type];
  const colors = NOTIFICATION_COLORS[type];

  return (
    <div 
      className={`
        ${colors.bg} ${colors.text} ${colors.border}
        flex items-center justify-between p-4 border rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
      `}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 ${colors.icon}`} />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="ml-4 hover:bg-gray-100 rounded-full p-1"
      >
        <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

// Custom hook for easy notification usage in components
export const useNotifications = () => {
  const { addNotification, TYPES } = useNotification();

  return {
    success: (message) => addNotification(message, TYPES.SUCCESS),
    error: (message) => addNotification(message, TYPES.ERROR),
    warning: (message) => addNotification(message, TYPES.WARNING),
    info: (message) => addNotification(message, TYPES.INFO)
  };
};

export default NotificationProvider;