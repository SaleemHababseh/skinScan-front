export const addMessage = (setMessages, type, content, timestamp = new Date()) => {
  const newMessage = {
    id: Date.now() + Math.random(),
    type, // 'incoming', 'outgoing', 'system'
    content,
    timestamp
  };
  setMessages((prev) => [...prev, newMessage]);
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
