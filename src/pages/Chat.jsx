import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import { addMessage, formatTime } from '../utils/chatUtils';
import { baseURL } from '../api/config';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const wsRef = useRef(null);

  const { appointment, chatPartner, appointmentId } = location.state || {};

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    if (!appointment || !chatPartner) {
      navigate(-1);
    }
  }, [appointment, chatPartner, navigate]);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!user || !chatPartner || !appointmentId || !token) {
        addMessage(setMessages, 'system', 'Missing required connection data. Please try again.');
        return;
      }

      const wsBaseUrl = baseURL.replace('https://', 'wss://').replace('http://', 'ws://').replace(/\/$/, '');
      const recipientId = chatPartner.id;
      const wsUrl = `${wsBaseUrl}/chat/ws/${recipientId}?token=${encodeURIComponent(token)}`;

      try {
        setConnectionStatus('Connecting...');
        wsRef.current = new WebSocket(wsUrl);

        const connectionTimeout = setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
            wsRef.current.close();
            setConnectionStatus('Connection Timeout');
            addMessage(setMessages, 'system', 'Connection timeout - please check your internet connection.');
          }
        }, 10000);

        wsRef.current.onopen = () => {
          clearTimeout(connectionTimeout);
          setIsConnected(true);
          setConnectionStatus('Connected');
          addMessage(setMessages, 'system', `Secure chat established with ${chatPartner?.name || 'Unknown User'} for appointment on ${new Date(appointment?.appointment_date || appointment?.dateTime).toLocaleDateString()}`);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            if (data.message) {
              addMessage(setMessages, 'incoming', data.message);
            } else if (data.error) {
              addMessage(setMessages, 'system', `Error: ${data.error}`);
            } else {
              addMessage(setMessages, 'incoming', event.data);
            }
          } catch {
            addMessage(setMessages, 'incoming', event.data);
          }
        };

        wsRef.current.onclose = () => {
          clearTimeout(connectionTimeout);
          setIsConnected(false);
          setConnectionStatus('Disconnected');
          addMessage(setMessages, 'system', 'Connection closed');
        };

        wsRef.current.onerror = () => {
          clearTimeout(connectionTimeout);
          setIsConnected(false);
          setConnectionStatus('Connection Error');
          addMessage(setMessages, 'system', 'Connection error occurred - click reconnect to try again.');
        };
      } catch {
        addMessage(setMessages, 'system', 'Failed to establish connection');
      }
    };

    if (user && chatPartner && appointmentId && token) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, chatPartner, appointmentId, token, appointment]);

  // Updated sendMessage function to send data in the specified format
  const sendMessage = () => {
    if (!message.trim()) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addMessage(setMessages, 'system', 'WebSocket not connected');
      return;
    }

    try {
      const sendStr = `${chatPartner.id}: ${message.trim()}`;
      wsRef.current.send(sendStr);
      addMessage(setMessages, 'outgoing', `You to ${chatPartner.id}: ${message.trim()}`);
      setMessage('');
    } catch {
      addMessage(setMessages, 'system', 'Failed to send message. Please check your connection and try again.');
    }
  };

  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    if (user && chatPartner && appointmentId && token) {
      const wsBaseUrl = baseURL.replace('https://', 'wss://').replace('http://', 'ws://').replace(/\/$/, '');
      const recipientId = chatPartner.id;
      const wsUrl = `${wsBaseUrl}/chat/ws/${recipientId}?token=${encodeURIComponent(token)}&appointment_id=${appointmentId}`;

      try {
        setConnectionStatus('Connecting...');
        wsRef.current = new WebSocket(wsUrl);

        const timeout = setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
            wsRef.current.close();
            setConnectionStatus('Connection Timeout');
            addMessage(setMessages, 'system', 'Reconnection timeout - please try again.');
          }
        }, 10000);

        wsRef.current.onopen = () => {
          clearTimeout(timeout);
          setIsConnected(true);
          setConnectionStatus('Connected');
          addMessage(setMessages, 'system', 'Reconnected successfully');
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message) {
              addMessage(setMessages, 'incoming', data.message);
            } else if (data.error) {
              addMessage(setMessages, 'system', `Error: ${data.error}`);
            } else {
              addMessage(setMessages, 'incoming', event.data);
            }
          } catch {
            addMessage(setMessages, 'incoming', event.data);
          }
        };

        wsRef.current.onclose = () => {
          clearTimeout(timeout);
          setIsConnected(false);
          setConnectionStatus('Disconnected');
          addMessage(setMessages, 'system', 'Connection closed');
        };

        wsRef.current.onerror = () => {
          clearTimeout(timeout);
          setIsConnected(false);
          setConnectionStatus('Connection Error');
          addMessage(setMessages, 'system', 'Reconnection failed - please try again.');
        };
      } catch {
        addMessage(setMessages, 'system', 'Failed to establish connection');
      }
    }
  };

  // Added API call to fetch chat history and updated message display logic
  const fetchChatHistory = async (receiverId) => {
    try {
      const response = await fetch(`${baseURL}chat/history?receiver_id=${receiverId}`);
      if (response.ok) {
        const history = await response.json();
        return history;
      } else {
        console.error('Failed to fetch chat history:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      if (chatPartner?.id) {
        const history = await fetchChatHistory(chatPartner.id);
        history.forEach((msg) => {
          const trimmedMessage = msg.split(': ')[1] || msg; // Trim message to exclude ID and ':'
          addMessage(setMessages, 'incoming', trimmedMessage);
        });
      }
    };

    loadChatHistory();
  }, [chatPartner]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-4xl">
        <ChatHeader
          navigate={navigate}
          chatPartner={chatPartner}
          isConnected={isConnected}
          connectionStatus={connectionStatus}
        />
        <ChatMessages messages={messages} formatTime={formatTime} />
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          isConnected={isConnected}
          connectionStatus={connectionStatus}
          reconnect={reconnect}
        />
      </div>
    </div>
  );
};

export default Chat;
