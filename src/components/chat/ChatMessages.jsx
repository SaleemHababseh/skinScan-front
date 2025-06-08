import React from 'react';

const ChatMessages = ({ messages, formatTime }) => {
  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.type === 'outgoing' ? 'justify-end' : msg.type === 'system' ? 'justify-center' : 'justify-start'}`}
        >
          {msg.type === 'system' ? (
            <div className="max-w-md text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-2">
                {msg.content}
              </p>
            </div>
          ) : (
            <div className={`max-w-md ${msg.type === 'outgoing' ? 'ml-auto' : 'mr-auto'}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.type === 'outgoing'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              <div className={`mt-1 text-xs text-neutral-500 dark:text-neutral-400 ${msg.type === 'outgoing' ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
