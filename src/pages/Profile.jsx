import React, { useState, useEffect, useCallback } from 'react';
import { Save, Edit2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import SecuritySettings from '../components/profile/SecuritySettings';
import DoctorCVSection from '../components/profile/DoctorCVSection';
import useAuthStore from '../store/auth-store';
import { useToast } from '../hooks/useToast';
import { baseURL } from '../api/config';
import { getDoctorBio } from '../api/users/getDoctorBio';

const Profile = () => {
  const { 
    user,
    isLoading,
    fetchUserBasicInfo,
    updateProfile,
    updateUserBio,
    uploadUserProfilePicture,
    updatePassword
  } = useAuthStore();
  
  const { showSuccess, showError } = useToast();
  
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
      try {
        await fetchUserBasicInfo();
          // Only set bio data for doctors
        let bioData = '';
        
        if (user.role === 'doctor') {
          try {
            // Get bio from multiple potential sources with doctor-specific endpoint
            const doctorBioData = await getDoctorBio(user.id);
            
            if (doctorBioData) {
              if (typeof doctorBioData === 'string') {
                bioData = doctorBioData;
              } else if (doctorBioData.Bio || doctorBioData.bio) {
                bioData = doctorBioData.Bio || doctorBioData.bio;
              } else if (doctorBioData.description) {
                bioData = doctorBioData.description;
              }
            }
          } catch {
            // If doctor bio fetch fails, fall back to user.bio for doctors only
            bioData = user.bio || '';
          }
        }
        
        // Set all profile data at once to avoid multiple state updates
        const avatarUrl = `${baseURL}users/get/user-profile-picture?user_id=${user.id}`;
        
        setProfileData({
          firstName: user.f_name || user.firstName || '',
          lastName: user.l_name || user.lastName || '',
          email: user.email || '',
          bio: bioData,
          avatarUrl: avatarUrl
        });
        
      } catch {
        // Error loading user info
      } finally {
        // Set to true regardless of success or failure to prevent re-fetching due to this flag.
        setHasLoadedUserInfo(true);
      }
    }
  }, [user?.id, user?.role, user?.bio, user?.email, user?.f_name, user?.firstName, user?.l_name, user?.lastName, hasLoadedUserInfo, fetchUserBasicInfo]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

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
      // Clean up previous object URL if it exists
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
      setSelectedFile(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (selectedFile) {
      try {
        await uploadUserProfilePicture(selectedFile);
        
        // Refresh profile picture after successful upload
        const avatarUrl = `${baseURL}users/get/user-profile-picture?user_id=${user.id}&t=${Date.now()}`;
        setProfileData(prev => ({
          ...prev,
          avatarUrl: avatarUrl
        }));
        
        // Clear the selected file
        setSelectedFile(null);
        
        showSuccess('Profile picture updated successfully');
      } catch {
        showError('Failed to upload profile picture');
      }
    }
  };
    const handleSaveProfile = async () => {
    try {
      // Upload profile picture first if one is selected
      if (selectedFile) {
        await handleUploadProfilePicture();
      }
      
      // Update basic information
      await updateProfile(profileData.firstName, profileData.lastName);

      // Update bio only if the user is a doctor and bio has changed
      if (user && user.role === 'doctor' && profileData.bio !== user.bio) {
        await updateUserBio(profileData.bio);
      }
      
      setIsEditing(false);
      showSuccess('Profile updated successfully');
      // window.location.reload();
    } catch {
      showError('Failed to update profile');
    } finally {
      // Always clear the selected file after save attempt (success or failure)
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
        setSelectedFile(null);
      }
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    try {
      await updatePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      showSuccess('Password updated successfully');
    } catch (err) {
      showError(`Error updating password: ${err.message}`);
    }
  };
  
  const handleCancel = () => {
    // Clean up object URL if it exists
    if (selectedFile) {
      URL.revokeObjectURL(URL.createObjectURL(selectedFile));
    }
    
    // Reset form to current profile data (which already includes doctor bio if applicable)
    // No need to fetch again since loadUserInfo already handled this
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
          <p className="mt-1 text-neutral-600">Manage your personal information and settings</p>
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
        <ProfileCard 
          profileData={profileData}
          selectedFile={selectedFile}
          user={user}
          isEditing={isEditing}
          onFileSelect={handleFileSelect}
        />
        
        <ProfileForm 
          profileData={profileData}
          user={user}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
        
        <SecuritySettings 
          passwordData={passwordData}
          showPasswordChange={showPasswordChange}
          isLoading={isLoading}
          onTogglePasswordChange={() => setShowPasswordChange(!showPasswordChange)}
          onPasswordChange={handlePasswordChange}
          onPasswordUpdate={handlePasswordUpdate}
          onCancel={() => {
            setShowPasswordChange(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          }}
        />
      </div>

      {/* Doctor CV Section - Only visible for doctors */}
      {user?.role === 'doctor' && (
        <DoctorCVSection />
      )}
    </div>
  );
};

export default Profile;
