import React from 'react';
import { Mail, Camera } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

const ProfileCard = ({ 
  profileData, 
  selectedFile, 
  user, 
  isEditing, 
  onFileSelect 
}) => {
  return (
    <Card className="md:col-span-1">
      <div className="flex flex-col items-center p-6 text-center">
        <div className="relative">
          <Avatar 
            src={selectedFile ? URL.createObjectURL(selectedFile) : `${profileData.avatarUrl}&t=${Date.now()}`} 
            alt={`${profileData.firstName} ${profileData.lastName}`}
            fallback={`${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`}
            className="h-24 w-24"
          />
          {selectedFile && (
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 bg-primary-500/10 flex items-center justify-center">
              <div className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            </div>
          )}
          {isEditing && (
            <div className="absolute bottom-0 right-0">
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                onChange={onFileSelect}
                className="hidden"
              />
              <label 
                htmlFor="profile-picture"
                className="flex cursor-pointer items-center justify-center rounded-full bg-primary-500 p-1.5 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
                title={selectedFile ? `Selected: ${selectedFile.name}` : "Change profile picture"}
              >
                <Camera className="h-4 w-4" />
              </label>
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
        
        {user?.role !== 'patient' && (
          <div className="mt-6 w-full border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <h3 className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">Bio</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {profileData.bio || 'No bio added yet.'}
            </p>
        
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCard;
