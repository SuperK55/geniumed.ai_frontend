import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialty?: string;
  about_me?: string;
  default_agent_id?: string;
  created_at?: string;
  last_login?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
      // Only check for token in localStorage, not user data
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setAuthState({ isAuthenticated: false, isLoading: false, user: null, token: null });
        navigate('/signin');
        return;
      }

      // Verify token with backend and get fresh user data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.ok) {
        // Token is valid, use fresh user data from backend
        const user = response.data.user;
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
    // Only store token in localStorage, user data stays in memory
    localStorage.setItem('auth_token', token);
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user,
      token,
    });
    navigate('/');
  };

  const updateUser = (updatedUser: User) => {
    setAuthState(prevState => ({
      ...prevState,
      user: updatedUser,
    }));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    });
    navigate('/signin');
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

