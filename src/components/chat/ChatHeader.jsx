import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { ArrowLeft, User, Wifi, WifiOff, MoreVertical, Star, Flag, FileText } from 'lucide-react';

const ChatHeader = ({ navigate, chatPartner, isConnected, connectionStatus, onRate, onReport, userRole, onViewRecords }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-neutral-200">
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-12 w-12 mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-neutral-900">
              {chatPartner?.name || 'Unknown User'}
            </h2>
            <p className="text-sm text-neutral-500 flex items-center">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 mr-2 text-green-500" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2 text-red-500" />
                  {connectionStatus}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className="h-12 w-12"
          >
            <MoreVertical className="h-6 w-6" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-12 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 min-w-48 z-20">
              {userRole === 'doctor' && (
                <button
                  onClick={() => {
                    onViewRecords?.();
                    setShowMenu(false);
                  }}
                  className="lg:hidden w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center space-x-3"
                >
                  <FileText className="h-5 w-5" />
                  <span>View Patient Records</span>
                </button>
              )}
              {userRole === 'patient' && (chatPartner?.role === 'doctor' || chatPartner?.type === 'doctor') && (
                <button
                  onClick={() => {
                    onRate();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center space-x-3"
                >
                  <Star className="h-5 w-5" />
                  <span>Rate Doctor</span>
                </button>
              )}
              <button
                onClick={() => {
                  onReport();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center space-x-3 text-red-600"
              >
                <Flag className="h-5 w-5" />
                <span>Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
