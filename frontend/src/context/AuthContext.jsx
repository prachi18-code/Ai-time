import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEMO_USER = {
  _id: 'demo',
  name: 'Aether User',
  email: 'demo@aether.ai',
  preferredStudyHours: 4,
  dailyAvailableTime: 6,
  isDemo: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aether_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate token on load
  useEffect(() => {
    const fetchUser = async () => {
      // Check for demo mode first
      const demoActive = localStorage.getItem('aether_demo') === 'true';
      if (demoActive) {
        setUser(DEMO_USER);
        setLoading(false);
        return;
      }

      if (token) {
        try {
          const userData = await api.getMe(token);
          setUser(userData);
        } catch (err) {
          console.error('Token validation failed:', err.message);
          // If network error (backend down), don't log out — just clear token
          localStorage.removeItem('aether_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('aether_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        preferredStudyHours: data.preferredStudyHours,
        dailyAvailableTime: data.dailyAvailableTime,
      });
      sessionStorage.setItem('just_logged_in', 'true');
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.register(name, email, password);
      localStorage.setItem('aether_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        preferredStudyHours: data.preferredStudyHours,
        dailyAvailableTime: data.dailyAvailableTime,
      });
      sessionStorage.setItem('just_logged_in', 'true');
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
      throw err;
    }
  };

  const demoLogin = () => {
    localStorage.setItem('aether_demo', 'true');
    sessionStorage.setItem('just_logged_in', 'true');
    setUser(DEMO_USER);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('aether_token');
    localStorage.removeItem('aether_demo');
    // NOTE: Do NOT remove onboarding data on logout — preserve it for re-login
    sessionStorage.removeItem('just_logged_in');
    sessionStorage.removeItem('aether_onboarding_step');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updatePreferences = async (profileData) => {
    try {
      const updatedUser = await api.updateProfile(profileData, token);
      setUser(prev => ({
        ...prev,
        ...updatedUser
      }));
      return true;
    } catch (err) {
      console.error('Failed to update preferences:', err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        demoLogin,
        updatePreferences,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
