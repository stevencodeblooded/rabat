export const notificationService = {
  success: (message, duration = 3000) => {
    if (window.showToast) {
      window.showToast.success(message);
    } else {
      console.log('Toast system not initialized');
    }
  },
  
  error: (message, duration = 3000) => {
    if (window.showToast) {
      window.showToast.error(message);
    } else {
      console.error(`ERROR: ${message}`);
    }
  },
  
  warning: (message, duration = 3000) => {
    if (window.showToast) {
      window.showToast.warning(message);
    } else {
      console.warn(`WARNING: ${message}`);
    }
  }
};