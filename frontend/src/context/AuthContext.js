// Authentication Context Provider

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.',
      };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await authAPI.googleLogin(credential);
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Get user profile
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed. Please try again.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isDelegate = () => {
    return user?.role === 'DELEGATE';
  };

  const isStudent = () => {
    return user?.role === 'STUDENT';
  };

  const isStaff = () => {
    return user?.role === 'ADMIN' || user?.role === 'DELEGATE';
  };

  const value = {
    user,
    loading,
    login,
    googleLogin,
    register,
    logout,
    isAdmin,
    isDelegate,
    isStudent,
    isStaff,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
