import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import PatientRecords from '../components/chat/PatientRecords';
import PatientRecordsModal from '../components/chat/PatientRecordsModal';
import RatingModal from '../components/chat/RatingModal';
import ReportModal from '../components/chat/ReportModal';
import { addMessage, formatTime } from '../utils/chatUtils';
import { createChatWebSocket, fetchChatHistory, sendChatMessage, rateDoctor } from '../api/chat';
import { submitReport, requiresUserId } from '../api/reportService';
import {useToast} from '../hooks/useToast';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const wsRef = useRef(null);
  const historyLoadedRef = useRef(false);

  const { appointment, chatPartner, appointmentId } = location.state || {};

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  
  const { showSuccess, showError } = useToast();

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

      try {
        setConnectionStatus('Connecting...');
        wsRef.current = createChatWebSocket(chatPartner.id, token);

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
      sendChatMessage(wsRef.current, chatPartner.id, message);
      addMessage(setMessages, 'outgoing', `You: ${message.trim()}`);
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
      try {
        setConnectionStatus('Connecting...');
        wsRef.current = createChatWebSocket(chatPartner.id, token, appointmentId);

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

  const handleRateDoctor = async (rating) => {
    try {
      await rateDoctor(chatPartner.id, rating, token);
      showSuccess('Rating submitted successfully!');
    } catch (error) {
      showError('Failed to submit rating. Please try again.');
      console.error('Rating error:', error);
    }
  };

  const handleReportUser = async (reportType, description) => {
    try {
      // Check if this report type requires a user ID
      const needsUserId = requiresUserId(reportType);
      
      if (needsUserId) {
        // For user-specific reports (abuse, spam), include the chat partner's ID
        await submitReport(reportType, description, chatPartner.id, token);
      } else {
        // For application errors, terms violations, and other reports, don't include user ID
        await submitReport(reportType, description, null, token);
      }
      
      showSuccess('Report submitted successfully!');
      return true; // Return success indicator
    } catch (error) {
      showError('Failed to submit report. Please try again.');
      console.error('Report error:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      // Prevent duplicate requests using ref
      if (historyLoadedRef.current || !chatPartner?.id || !user?.id || !token) {
        return;
      }

      historyLoadedRef.current = true;

      try {
        const history = await fetchChatHistory(chatPartner.id, token);
        
        // Sort messages by sent_at timestamp to maintain chronological order
        const sortedHistory = history.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
        
        const partnerName = chatPartner?.name || 'Unknown';
        
        // Create new messages array with proper structure
        const historyMessages = sortedHistory.map((msg) => {
          const messageType = msg.sender_id === user.id ? 'outgoing' : 'incoming';
          const senderName = msg.sender_id === user.id ? 'You' : partnerName;
          const displayMessage = `${senderName}: ${msg.content}`;
          
          return {
            id: Date.now() + Math.random(),
            type: messageType,
            content: displayMessage,
            timestamp: new Date(msg.sent_at)
          };
        });

        // Set messages directly instead of appending to avoid duplicates
        setMessages(historyMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    // Only load history once when component mounts and required data is available
    if (chatPartner?.id && user?.id && token && !historyLoadedRef.current) {
      loadChatHistory();
    }
  }, [chatPartner?.id, user?.id, token, chatPartner?.name]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Both doctor and patient views now use consistent full-width styling */}
      <div className="h-screen flex flex-col">
        <div className="w-full flex flex-col h-full">
          <ChatHeader
            navigate={navigate}
            chatPartner={chatPartner}
            isConnected={isConnected}
            connectionStatus={connectionStatus}
            onRate={() => setShowRatingModal(true)}
            onReport={() => setShowReportModal(true)}
            onViewRecords={user?.role === 'doctor' ? () => setShowRecordsModal(true) : undefined}
            userRole={user?.role}
          />
          <div className="flex-1 flex flex-col min-h-0">
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
      </div>
      
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRateDoctor}
        doctorName={chatPartner?.name}
      />
      
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportUser}
      />
      
      {/* Mobile Patient Records Modal for Doctors */}
      {user?.role === 'doctor' && (
        <PatientRecordsModal
          isOpen={showRecordsModal}
          onClose={() => setShowRecordsModal(false)}
          patientId={chatPartner?.id}
          token={token}
          patientName={chatPartner?.name}
        />
      )}
    </div>
  );
};

export default Chat;
