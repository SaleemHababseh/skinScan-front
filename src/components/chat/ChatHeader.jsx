import React from 'react';
import Button from '../ui/Button';
import { ArrowLeft, User, Wifi, WifiOff } from 'lucide-react';

const ChatHeader = ({ navigate, chatPartner, isConnected, connectionStatus }) => {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10 mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-neutral-800"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              {chatPartner?.name || 'Unknown User'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1 text-green-500" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1 text-red-500" />
                  {connectionStatus}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
