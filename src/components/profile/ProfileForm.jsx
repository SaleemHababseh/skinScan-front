import React from 'react';
import { Mail } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';

const ProfileForm = ({ 
  profileData, 
  user, 
  isEditing, 
  onChange 
}) => {
  return (
    <Card className="md:col-span-2">
      <div className="p-6">
        <h2 className="text-lg font-medium text-neutral-900">
          {isEditing ? 'Edit Profile Information' : 'Profile Information'}
        </h2>
        
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-neutral-700">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-neutral-700">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700">
              Email Address
            </label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={onChange}
                disabled={true} // Email is typically not editable
                className="pl-9"
              />
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>
            <p className="mt-1 text-xs text-neutral-500">Email cannot be changed.</p>
          </div>
          
          {user?.role !== 'patient' && (
            <div>
              <label htmlFor="bio" className="mb-1 block text-sm font-medium text-neutral-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={profileData.bio}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileForm;
