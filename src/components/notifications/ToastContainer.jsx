import React from 'react';

const ToastContainer = ({ children }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {children}
    </div>
  );
};

export default ToastContainer;