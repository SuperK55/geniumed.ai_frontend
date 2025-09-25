import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook from AuthContext for backward compatibility
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 