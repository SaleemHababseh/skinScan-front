import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Lock, Shield, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import useAuthStore from '../store/auth-store';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    bio: '',
    avatarUrl: ''
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    updateProfile(profileData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Profile</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <div className="flex flex-col items-center p-6 text-center">
            <div className="relative">
              <Avatar 
                src={profileData.avatarUrl} 
                alt={`${profileData.firstName} ${profileData.lastName}`}
                fallback={`${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`}
                className="h-24 w-24"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-primary-500 p-1.5 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {user?.role?.[0]?.toUpperCase()}{user?.role?.slice(1)}
            </p>
            
            <div className="mt-6 w-full">
              <div className="flex items-center border-t border-neutral-200 py-3 dark:border-neutral-800">
                <Mail className="h-5 w-5 text-neutral-500" />
                <span className="ml-2 text-sm text-neutral-800 dark:text-neutral-200">{profileData.email}</span>
              </div>
              <div className="flex items-center border-t border-neutral-200 py-3 dark:border-neutral-800">
                <Phone className="h-5 w-5 text-neutral-500" />
                <span className="ml-2 text-sm text-neutral-800 dark:text-neutral-200">
                  {profileData.phone || 'No phone number added'}
                </span>
              </div>
              <div className="flex items-center border-t border-neutral-200 py-3 dark:border-neutral-800">
                <MapPin className="h-5 w-5 text-neutral-500" />
                <span className="ml-2 text-sm text-neutral-800 dark:text-neutral-200">
                  {profileData.address || 'No address added'}
                </span>
              </div>
              <div className="flex items-center border-t border-neutral-200 py-3 dark:border-neutral-800">
                <Calendar className="h-5 w-5 text-neutral-500" />
                <span className="ml-2 text-sm text-neutral-800 dark:text-neutral-200">
                  {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'No date of birth added'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 w-full border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <h3 className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">Bio</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {profileData.bio || 'No bio added yet.'}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Profile Information Form */}
        <Card className="md:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {isEditing ? 'Edit Profile Information' : 'Profile Information'}
            </h2>
            
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email is typically not editable
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
                <p className="mt-1 text-xs text-neutral-500">Email cannot be changed.</p>
              </div>
              
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                    className="pl-9"
                  />
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Address
                </label>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className="pl-9"
                  />
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Date of Birth
                </label>
                <div className="relative">
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>
              
              <div>
                <label htmlFor="bio" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Security Settings */}
        <Card className="md:col-span-3">
          <div className="p-6">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Security</h2>
            
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                <div>
                  <div className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-neutral-500" />
                    <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Password</h3>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Update your password to keep your account secure
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                <div>
                  <div className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-neutral-500" />
                    <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Two-Factor Authentication</h3>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Setup 2FA</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-neutral-500" />
                    <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Login History</h3>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    View your recent login activity
                  </p>
                </div>
                <Button variant="outline">View History</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;