import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
import { notify } from '@/utils/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import logo from '../assets/imgs/logo_p.png';


const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signin`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.ok) {
        // Use the auth hook's login method
        notify.success('Sign In Successful', {
          description: 'Signed in successfully.',
          duration: 4000
        });
        login(response.data.token, response.data.user);
      } else {
        // Show error message
        notify.error('Sign In Failed', {
          description: response.data.error || 'Invalid credentials. Please try again.',
          duration: 5000
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle different types of errors
      if (error.response?.data?.error) {
        notify.error('Sign In Failed', {
          description: error.response.data.error || 'Invalid email or password.',
          duration: 5000
        });
      } else if (error.response?.status === 401) {
        notify.error('Invalid Credentials', {
          description: 'Invalid email or password. Please check your credentials.',
          duration: 5000
        });
      } else if (error.response?.status === 500) {
        notify.error('Server Error', {
          description: 'Server error occurred. Please try again later.',
          duration: 6000
        });
      } else {
        notify.error('Network Error', {
          description: 'Network error occurred. Please check your connection.',
          duration: 6000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-row justify-center mb-6">
          <img src={logo} alt="Geniumed Logo" className="h-16" />
        </div>

        {/* Sign In Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row justify-center">
            <CardTitle className="text-2xl text-center text-gray-900">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500 pr-10"
                    style={{ 
                      boxShadow: 'none',
                      WebkitBoxShadow: 'none'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90 h-11 rounded-xl font-medium"
                disabled={!formData.email || !formData.password || isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="mailto:fcanuto@gmail.com" className="text-primary hover:text-primary/80 font-medium">
                  Contact administrator
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Geniumed. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 