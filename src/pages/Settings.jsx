import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet, 
  AlignLeft, 
  Save,
  Check
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import {useTheme} from '../store/theme-store';
import useAuthStore from '../store/auth-store';

const Settings = () => {
  const { user, updatePreferences } = useAuthStore();
  const { theme } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const [preferences, setPreferences] = useState({
    language: 'en',
    emailNotifications: {
      appointments: true,
      diagnosisResults: true,
      news: false,
      reminders: true
    },
    privacy: {
      profileVisibility: 'public',
      shareDataForResearch: true
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    }
  });
  
  useEffect(() => {
    // Load user preferences from store
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);
  
  const handleInputChange = (section, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };
  
  const handleLanguageChange = (e) => {
    setPreferences(prev => ({
      ...prev,
      language: e.target.value
    }));
    setHasChanges(true);
  };
  
  const savePreferences = () => {
    updatePreferences(preferences);
    setHasChanges(false);
  };
  
  const devices = [
    { name: 'Chrome / Windows', type: 'desktop', lastActive: 'Now', current: true },
    { name: 'Safari / iPhone', type: 'mobile', lastActive: '2 days ago', current: false },
    { name: 'Firefox / Mac', type: 'desktop', lastActive: '1 week ago', current: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your application preferences</p>
        </div>
        <Button 
          onClick={savePreferences}
          disabled={!hasChanges}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Theme Settings */}
        <Card className="md:col-span-1">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-100 dark:bg-primary-900">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Sun className="h-5 w-5 text-primary-600" />
                )}
              </div>
              <h2 className="ml-3 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Appearance
              </h2>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Theme Mode
                </label>
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Language
                </label>
                <select 
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  value={preferences.language}
                  onChange={handleLanguageChange}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ar">العربية</option>
                </select>
                <div className="mt-2 flex items-center">
                  <Globe className="h-4 w-4 text-neutral-500" />
                  <span className="ml-2 text-xs text-neutral-500">
                    Changing language affects the entire application
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Notification Settings */}
        <Card className="md:col-span-2">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary-100 dark:bg-secondary-900">
                <Bell className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h2 className="ml-3 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Notifications
              </h2>
            </div>
            
            <div className="mt-6 space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Choose which notifications you'd like to receive via email
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Appointments
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Get notified about upcoming appointments
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={preferences.emailNotifications?.appointments} 
                      onChange={(e) => handleInputChange('emailNotifications', 'appointments', e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Diagnosis Results
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Get notified when new diagnosis results are available
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={preferences.emailNotifications?.diagnosisResults} 
                      onChange={(e) => handleInputChange('emailNotifications', 'diagnosisResults', e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      News & Updates
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Receive newsletters and product updates
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={preferences.emailNotifications?.news} 
                      onChange={(e) => handleInputChange('emailNotifications', 'news', e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Reminders
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Get reminded about scheduled check-ups
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={preferences.emailNotifications?.reminders} 
                      onChange={(e) => handleInputChange('emailNotifications', 'reminders', e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Privacy Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success-100 dark:bg-success-900">
                <Shield className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <h2 className="ml-3 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Privacy & Data
              </h2>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Profile Visibility
                </label>
                <select 
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  value={preferences.privacy?.profileVisibility}
                  onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="contacts">Contacts Only - Only visible to your doctors</option>
                  <option value="private">Private - Only visible to you</option>
                </select>
                <div className="mt-2 flex items-center">
                  <Eye className="h-4 w-4 text-neutral-500" />
                  <span className="ml-2 text-xs text-neutral-500">
                    Controls who can see your profile information
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Share Data for Research
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Allow anonymized data to be used for medical research
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={preferences.privacy?.shareDataForResearch} 
                    onChange={(e) => handleInputChange('privacy', 'shareDataForResearch', e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                </label>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                  Request a copy of all your personal data in a portable format
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Accessibility Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-info-100 dark:bg-info-900">
                <AlignLeft className="h-5 w-5 text-info-600 dark:text-info-400" />
              </div>
              <h2 className="ml-3 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Accessibility
              </h2>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Font Size
                </label>
                <select 
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  value={preferences.accessibility?.fontSize}
                  onChange={(e) => handleInputChange('accessibility', 'fontSize', e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium (Recommended)</option>
                  <option value="large">Large</option>
                  <option value="x-large">Extra Large</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    High Contrast Mode
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Increase contrast for better visibility
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={preferences.accessibility?.highContrast} 
                    onChange={(e) => handleInputChange('accessibility', 'highContrast', e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Reduce Motion
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Minimize animations throughout the application
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={preferences.accessibility?.reducedMotion} 
                    onChange={(e) => handleInputChange('accessibility', 'reducedMotion', e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-neutral-700 dark:peer-checked:bg-primary-600 dark:peer-focus:ring-primary-800"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Connected Devices */}
        <Card className="md:col-span-1">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                <Monitor className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="ml-3 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Connected Devices
              </h2>
            </div>
            
            <div className="mt-6 space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Devices currently or recently logged into your account
              </p>
              
              <div className="space-y-4">
                {devices.map((device, index) => (
                  <div key={index} className="flex items-start justify-between rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
                    <div className="flex items-center">
                      {device.type === 'desktop' ? (
                        <Monitor className="h-5 w-5 text-neutral-500" />
                      ) : device.type === 'mobile' ? (
                        <Smartphone className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <Tablet className="h-5 w-5 text-neutral-500" />
                      )}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {device.name}
                        </p>
                        <div className="mt-1 flex items-center">
                          <p className="text-xs text-neutral-500">
                            {device.lastActive}
                          </p>
                          {device.current && (
                            <span className="ml-2 flex items-center text-xs text-success-600 dark:text-success-400">
                              <Check className="mr-1 h-3 w-3" /> Current
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!device.current && (
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;