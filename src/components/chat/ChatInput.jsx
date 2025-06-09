import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Send, WifiOff } from 'lucide-react';

const ChatInput = ({ message, setMessage, sendMessage, isConnected, connectionStatus, reconnect }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="resize-none border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500"
            maxLength={1000}
          />
        </div>
        <Button
          onClick={sendMessage}
          disabled={!message.trim() || !isConnected}
          className="h-12 w-12 p-0 rounded-full"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {!isConnected && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center">
            <WifiOff className="h-5 w-5 mr-2" />
            {connectionStatus}
          </p>
          {(connectionStatus === 'Connection Error' || connectionStatus === 'Connection Timeout' || connectionStatus === 'Disconnected') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reconnect}
              className="text-primary-600 border-primary-200 hover:bg-primary-50"
            >
              Reconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
