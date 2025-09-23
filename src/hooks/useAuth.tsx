import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        // No token or user data, redirect to sign in
        setAuthState({ isAuthenticated: false, isLoading: false, user: null, token: null });
        navigate('/signin');
        return;
      }

      // Verify token with backend
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.ok) {
        // Token is valid
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          token,
        });
      } else {
        // Token is invalid
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  };

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user,
      token,
    });
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    });
    navigate('/signin');
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
  };
}; 