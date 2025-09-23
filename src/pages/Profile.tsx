import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit2, 
  Save, 
  X,
  Camera,
  Key,
  Bell,
  Globe,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  specialty: string;
  licenseNumber: string;
  experience: string;
  timezone: string;
  language: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.name || 'Dr. Fernand',
    email: user?.email || 'fernand@medcare.com',
    phone: '+1 (555) 123-4567',
    address: 'Medical Center, 123 Health Street, New York, NY 10001',
    bio: 'Experienced cardiologist with over 15 years of practice. Specialized in interventional cardiology and heart disease prevention.',
    specialty: 'Cardiology',
    licenseNumber: 'MD-123456789',
    experience: '15+ years',
    timezone: 'EST (UTC-5)',
    language: 'English'
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = () => {
    // TODO: Implement API call to update profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // TODO: Implement API call to change password
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsPasswordModalOpen(false);
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      doctor: 'bg-blue-100 text-blue-700 border-blue-200',
      nurse: 'bg-green-100 text-green-700 border-green-200',
      staff: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    return (
      <Badge className={roleColors[role.toLowerCase()] || roleColors.staff}>
        <Shield className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleProfileSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-white">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-gray-300"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl text-gray-900">{profileData.name}</CardTitle>
              <CardDescription className="text-gray-600">{profileData.specialty}</CardDescription>
              <div className="flex justify-center mt-2">
                {getRoleBadge(user?.role || 'doctor')}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {profileData.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {profileData.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {profileData.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Joined March 2020
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                      Update your password to keep your account secure.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange}>
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-900"
                    style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-900"
                    style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-900"
                    style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => handleInputChange('timezone', value)} disabled={!isEditing}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="EST (UTC-5)">EST (UTC-5)</SelectItem>
                      <SelectItem value="CST (UTC-6)">CST (UTC-6)</SelectItem>
                      <SelectItem value="MST (UTC-7)">MST (UTC-7)</SelectItem>
                      <SelectItem value="PST (UTC-8)">PST (UTC-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-900"
                  style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-900"
                  style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Professional Information</CardTitle>
              <CardDescription>Your medical credentials and professional details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Medical Specialty</Label>
                  <Select value={profileData.specialty} onValueChange={(value) => handleInputChange('specialty', value)} disabled={!isEditing}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select value={profileData.experience} onValueChange={(value) => handleInputChange('experience', value)} disabled={!isEditing}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="6-10 years">6-10 years</SelectItem>
                      <SelectItem value="11-15 years">11-15 years</SelectItem>
                      <SelectItem value="15+ years">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={profileData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-900"
                    style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Primary Language</Label>
                  <Select value={profileData.language} onValueChange={(value) => handleInputChange('language', value)} disabled={!isEditing}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 