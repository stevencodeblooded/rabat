export const logError = (error, context = "General") => {
  console.error(`Error in ${context}:`, error);

  // Optional: Send to error tracking service
  // errorTrackingService.log(error, context);
};

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    switch (error.response.status) {
      case 400:
        return {
          type: "validation",
          message: "Invalid request. Please check your input.",
          details: error.response.data,
        };
      case 401:
        return {
          type: "authentication",
          message: "Unauthorized. Please log in again.",
          action: "redirect_to_login",
        };
      case 403:
        return {
          type: "authorization",
          message: "You do not have permission to perform this action.",
          details: error.response.data,
        };
      case 404:
        return {
          type: "not_found",
          message: "The requested resource could not be found.",
          details: error.response.data,
        };
      case 500:
        return {
          type: "server_error",
          message:
            "An unexpected server error occurred. Please try again later.",
          details: error.response.data,
        };
      default:
        return {
          type: "unknown",
          message: "An unexpected error occurred.",
          details: error.response.data,
        };
    }
  } else if (error.request) {
    // The request was made but no response was received
    return {
      type: "network",
      message:
        "No response received from server. Please check your internet connection.",
      details: error.request,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      type: "request_setup",
      message: "Error setting up the request.",
      details: error.message,
    };
  }
};

// Notification service for displaying user-friendly messages
export const notificationService = {
  success: (message, duration = 3000) => {
    // Implement toast or notification mechanism
    console.log("SUCCESS:", message);
  },
  error: (message, duration = 3000) => {
    // Implement toast or notification mechanism
    console.error("ERROR:", message);
  },
  warning: (message, duration = 3000) => {
    // Implement toast or notification mechanism
    console.warn("WARNING:", message);
  },
};

// Environment configuration utility
export const environmentConfig = {
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === "development",
  isProduction: process.env.REACT_APP_ENVIRONMENT === "production",
  getConfig: (key) => process.env[`REACT_APP_${key.toUpperCase()}`],

  // Feature flag check
  isFeatureEnabled: (featureName) => {
    const featureKey = `REACT_APP_FEATURE_${featureName.toUpperCase()}_ENABLED`;
    return process.env[featureKey] === "true";
  },
};
