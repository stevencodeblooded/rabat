// src/services/localStorageService.js
const localStorageService = {
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    },
    
    getItem: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage', error);
        return null;
      }
    },
    
    removeItem: (key) => {
      localStorage.removeItem(key);
    },
  
    clear: () => {
      localStorage.clear();
    }
  };
  
  export default localStorageService;