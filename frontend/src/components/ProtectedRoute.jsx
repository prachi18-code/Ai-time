import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, onNavigateToLogin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-bg flex flex-col items-center justify-center text-slate-300 font-sans">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
        </div>
        <p className="font-space text-sm tracking-wider text-purple-400 animate-pulse">AETHER CORE LOADING...</p>
      </div>
    );
  }

  if (!user) {
    // If not logged in, trigger redirect to login tab/route
    onNavigateToLogin();
    return null;
  }

  return children;
};

export default ProtectedRoute;
