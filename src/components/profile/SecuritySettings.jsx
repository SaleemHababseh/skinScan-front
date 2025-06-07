import React from 'react';
import { Lock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SecuritySettings = ({ 
  passwordData, 
  showPasswordChange, 
  isLoading,
  onTogglePasswordChange,
  onPasswordChange,
  onPasswordUpdate,
  onCancel
}) => {
  return (
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
              onClick={onTogglePasswordChange}
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
                  onChange={onPasswordChange}
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
                  onChange={onPasswordChange}
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
                  onChange={onPasswordChange}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onPasswordUpdate}
                  disabled={isLoading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SecuritySettings;
