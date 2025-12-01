// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status and premium status
    const savedUser = localStorage.getItem('jfft_user');
    const premiumStatus = localStorage.getItem('jfft_premium');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Set premium status based on user data or stored premium status
      setIsPremium(userData?.isPremium || JSON.parse(premiumStatus) || false);
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Ensure userType is preserved
    localStorage.setItem('jfft_user', JSON.stringify(userData));
    if (userData.isPremium) {
      setIsPremium(true);
      localStorage.setItem('jfft_premium', 'true');
    }
  };

  const logout = () => {
    setUser(null);
    setIsPremium(false);
    localStorage.removeItem('jfft_user');
    localStorage.removeItem('jfft_premium');
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('jfft_premium', 'true');
    // Update user data with premium status
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      localStorage.setItem('jfft_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isPremium,
    loading,
    login,
    logout,
    upgradeToPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};