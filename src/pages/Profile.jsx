import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Camera, Lock, Shield, Save, Upload, Edit2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import useAuthStore from '../store/auth-store';

const Profile = () => {
  const { 
    user,
    isLoading,
    error,
    fetchUserBasicInfo,
    updateProfile,
    updateUserBio,
    uploadUserProfilePicture,
    updatePassword,
    clearError
  } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    avatarUrl: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasLoadedUserInfo, setHasLoadedUserInfo] = useState(false);

  const loadUserInfo = useCallback(async () => {
    if (user?.id && !hasLoadedUserInfo) {
      console.log(`loadUserInfo: Attempting to fetch for user ${user.id}. hasLoadedUserInfo: ${hasLoadedUserInfo}`);
      try {
        await fetchUserBasicInfo();
        console.log('loadUserInfo: Fetch successful.');
        
        // Set profile picture URL directly
        const avatarUrl = `https://f064-87-236-233-66.ngrok-free.app/users/get/user-profile-picture?user_id=${user.id}`;
        setProfileData(prev => ({
          ...prev,
          avatarUrl: avatarUrl
        }));
      } catch (error) {
        console.error('loadUserInfo: Error loading user info:', error);
      } finally {
        // Set to true regardless of success or failure to prevent re-fetching due to this flag.
        console.log('loadUserInfo: Setting hasLoadedUserInfo to true in finally block.');
        setHasLoadedUserInfo(true);
      }
    }
  }, [user?.id, hasLoadedUserInfo, fetchUserBasicInfo]); // Corrected dependencies

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);
  
  useEffect(() => {
    // Update form data when user changes
    if (user) {
      setProfileData({
        firstName: user.f_name || user.firstName || '',
        lastName: user.l_name || user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        avatarUrl: user.profilePicture || user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (selectedFile) {
      try {
        await uploadUserProfilePicture(selectedFile);
        setSelectedFile(null);
        
        // Refresh profile picture after successful upload
        const avatarUrl = `https://f064-87-236-233-66.ngrok-free.app/users/get/user-profile-picture?user_id=${user.id}`;
        setProfileData(prev => ({
          ...prev,
          avatarUrl: avatarUrl
        }));
      } catch (err) {
        console.error('Error uploading profile picture:', err);
      }
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      // Update basic information
      await updateProfile(profileData.firstName, profileData.lastName);
      
      // Update bio if it changed
      if (user && profileData.bio !== user.bio) {
        await updateUserBio(profileData.bio);
      }
      
      setIsEditing(false);
      // Optionally show success message
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await updatePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      alert('Password updated successfully');
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Error updating password: ' + err.message);
    }
  };
  
  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setProfileData({
        firstName: user.f_name || user.firstName || '',
        lastName: user.l_name || user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        avatarUrl: user.profilePicture || user.avatarUrl || ''
      });
    }
    setIsEditing(false);
    clearError();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Profile</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Main Profile Content */}
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
                <div className="absolute bottom-0 right-0">
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label 
                    htmlFor="profile-picture"
                    className="flex cursor-pointer items-center justify-center rounded-full bg-primary-500 p-1.5 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  {selectedFile && (
                    <Button
                      size="sm"
                      onClick={handleUploadProfilePicture}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      disabled={isLoading}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Upload
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {user?.role?.[0]?.toUpperCase()}{user?.role?.slice(1)} User
            </p>
            
            <div className="mt-6 w-full">
              <div className="flex items-center border-t border-neutral-200 py-3 dark:border-neutral-800">
                <Mail className="h-5 w-5 text-neutral-500" />
                <span className="ml-2 text-sm text-neutral-800 dark:text-neutral-200">{profileData.email}</span>
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
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Security Settings</h2>
            
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
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                  Change Password
                </Button>
              </div>
              
              {showPasswordChange && (
                <div className="space-y-4 rounded-md border border-neutral-200 p-4 dark:border-neutral-700">
                  <div>
                    <label htmlFor="oldPassword" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Current Password
                    </label>
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePasswordUpdate}
                      disabled={isLoading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
