import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/utils/notifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Edit2, 
  Save, 
  X,
  Key,
  Building2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';

interface ProfileFormData {
  name: string;
  specialty: string;
  social_proof_enabled: boolean;
  social_proof_text: string;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form state - direct mapping from user fields
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.name || '',
    specialty: user?.specialty || '',
    social_proof_enabled: user?.social_proof_enabled || false,
    social_proof_text: user?.social_proof_text || ''
  });

  // Temporary form state for editing (only committed on save)
  const [tempProfileData, setTempProfileData] = useState<ProfileFormData>({
    name: user?.name || '',
    specialty: user?.specialty || '',
    social_proof_enabled: user?.social_proof_enabled || false,
    social_proof_text: user?.social_proof_text || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        specialty: user.specialty || '',
        social_proof_enabled: user.social_proof_enabled || false,
        social_proof_text: user.social_proof_text || ''
      };
      setProfileData(userData);
      setTempProfileData(userData);
    }
  }, [user]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
        return;
      }
      
      // Send simplified fields directly - no mapping needed
      const updateData = {
        name: tempProfileData.name,
        specialty: tempProfileData.specialty,
        social_proof_enabled: tempProfileData.social_proof_enabled,
        social_proof_text: tempProfileData.social_proof_text
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        // Update user context directly
        updateUser(response.data.user);
        
        // Commit the temporary data to the main profile data
        setProfileData(tempProfileData);
        
        setIsEditing(false);
        notify.success('Profile Updated Successfully!', {
          description: 'Your profile information has been saved.',
          duration: 4000
        });
      } else {
        notify.error('Failed to Update Profile', {
          description: response.data.error || 'An unexpected error occurred.',
          duration: 6000
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      notify.error('Failed to Update Profile', {
        description: error.response?.data?.error || error.message || 'Network error occurred.',
        duration: 6000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.warning('Password Mismatch', {
        description: 'New passwords do not match. Please try again.',
        duration: 4000
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      notify.warning('Password Too Short', {
        description: 'New password must be at least 8 characters long.',
        duration: 4000
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsPasswordModalOpen(false);
        notify.success('Password Changed Successfully!', {
          description: 'Your password has been updated.',
          duration: 4000
        });
      } else {
        notify.error('Failed to Change Password', {
          description: response.data.error || 'An unexpected error occurred.',
          duration: 6000
        });
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      notify.error('Failed to Change Password', {
        description: error.response?.data?.error || error.message || 'Network error occurred.',
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string | boolean) => {
    setTempProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditStart = () => {
    // Reset temp data to current profile data when starting to edit
    setTempProfileData(profileData);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    // Revert temp data back to original profile data
    setTempProfileData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your business information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleEditCancel}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleProfileSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleEditStart}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="max-w-4xl space-y-6">
        
        {/* Professional Information */}
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Business / Professional Name</Label>
                <Input
                  id="name"
                  value={isEditing ? tempProfileData.name : profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                  
                  placeholder="Enter your business / professional name"
                />
              </div>

              <div>
                <Label htmlFor="specialty">Specialty / Services</Label>
                <Input
                  id="specialty"
                  value={isEditing ? tempProfileData.specialty : profileData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                  
                  placeholder="Enter your specialty / services"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="social_proof_enabled">Social Proof Enabled</Label>
                  <Switch
                    id="social_proof_enabled"
                    checked={isEditing ? tempProfileData.social_proof_enabled : profileData.social_proof_enabled}
                    onCheckedChange={(checked) => handleInputChange('social_proof_enabled', checked)}
                    disabled={!isEditing}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Enable to include a realistic success case in conversations.</p>
              </div>

              {(isEditing ? tempProfileData.social_proof_enabled : profileData.social_proof_enabled) && (
                <div>
                  <Label htmlFor="social_proof_text">Social Proof</Label>
                  <Textarea
                    id="social_proof_text"
                    value={isEditing ? tempProfileData.social_proof_text : profileData.social_proof_text}
                    onChange={(e) => handleInputChange('social_proof_text', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                    placeholder="One concise story that matches your service (e.g., 'Dr. Silva helped Maria overcome her anxiety in just 3 sessions')."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security and authentication.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Change Password</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                                      <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                          
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                          
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20"
                        />
                       </div>
                    </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} disabled={isLoading}>
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 