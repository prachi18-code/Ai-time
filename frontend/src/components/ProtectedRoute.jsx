import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, onNavigateToLogin }) => {
  const { user, loading } = useAuth();

  // Use effect to avoid side effects during render (prevents infinite loops)
  useEffect(() => {
    if (!loading && !user) {
      onNavigateToLogin();
    }
  }, [user, loading, onNavigateToLogin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-300 font-sans">
        <div className="relative w-10 h-10 mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 animate-spin" />
        </div>
        <p className="font-space text-[10px] tracking-wider text-purple-400 animate-pulse uppercase">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
