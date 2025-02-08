// src/services/notificationService.js

export const notificationService = {
    success: (message, duration = 3000) => {
      // In a real-world scenario, you might use a toast library
      console.log(`SUCCESS: ${message}`);
      
      // Optional: Implement toast notification
      alert(message);
    },
    
    error: (message, duration = 3000) => {
      // In a real-world scenario, you might use a toast library
      console.error(`ERROR: ${message}`);
      
      // Optional: Implement toast notification
      alert(message);
    },
    
    warning: (message, duration = 3000) => {
      // In a real-world scenario, you might use a toast library
      console.warn(`WARNING: ${message}`);
      
      // Optional: Implement toast notification
      alert(message);
    }
  };