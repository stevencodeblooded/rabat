// src/components/notifications/Toast.jsx
import React, { useState, useEffect } from 'react';
import { 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  XIcon 
} from '@heroicons/react/outline';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100',
          border: 'border-green-500',
          text: 'text-green-800',
          icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          border: 'border-red-500',
          text: 'text-red-800',
          icon: <XCircleIcon className="w-5 h-5 text-red-500" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-500',
          text: 'text-yellow-800',
          icon: <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-500',
          text: 'text-gray-800',
          icon: <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        ${styles.bg} ${styles.text} ${styles.border}
        border rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        flex items-center gap-2 min-w-[300px] p-4
      `}
    >
      {styles.icon}
      <p className="flex-1">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;