// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const AgoraPage = lazy(() => import('./pages/AgoraPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EchappeesPage = lazy(() => import('./pages/EchappeesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const ProtectedRoute = ({ children }) => {
  const auth = React.useContext(AuthContext);
  
  if (auth.isLoading) {
    return <LoadingSpinner fullScreen />;
  }
  
  if (!auth.user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const ErrorBoundaryWrapper = ({ component: Component }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route 
      path="/" 
      element={<ErrorBoundaryWrapper component={HomePage} />} 
    />
    <Route 
      path="/map" 
      element={<ErrorBoundaryWrapper component={MapPage} />} 
    />
    <Route 
      path="/auth" 
      element={<ErrorBoundaryWrapper component={AuthPage} />} 
    />
    
    {/* Protected Routes */}
    <Route 
      path="/agora" 
      element={
        <ProtectedRoute>
          <ErrorBoundaryWrapper component={AgoraPage} />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <ErrorBoundaryWrapper component={ProfilePage} />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/echappees" 
      element={
        <ProtectedRoute>
          <ErrorBoundaryWrapper component={EchappeesPage} />
        </ProtectedRoute>
      } 
    />
    
    {/* 404 Route */}
    <Route 
      path="*" 
      element={<ErrorBoundaryWrapper component={NotFoundPage} />} 
    />
  </Routes>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <AppRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;