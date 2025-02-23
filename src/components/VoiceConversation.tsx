import React, { useState, useEffect } from 'react';
import { Conversation } from '@11labs/client';

const VoiceConversation = () => {
  const [conversation, setConversation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        setError('Failed to access microphone.');
      }
    };

    initializeMedia();
  }, []);

  const startConversation = async () => {
    try {
      const conv = await Conversation.startSession({
        agentId: '5gMZf51LYKch9cJeSEiH', 
        onConnect: () => {
          setIsConnected(true);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setConversation(null);
        },
        onError: (error) => {
          console.error('Error:', error);
          setError('Conversation error occurred.');
        },
        onModeChange: (mode) => {
          setAgentStatus(mode.mode);
        },
      });
      setConversation(conv);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation.');
    }
  };

  const stopConversation = async () => {
    if (conversation) {
      await conversation.endSession();
      setConversation(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Voice Conversation with AI Agent</h1>
      <div className="mb-4">
        <span className={`text-lg ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="mb-4">
        <span className="text-lg">Agent Status: {agentStatus}</span>
      </div>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      <div className="flex space-x-4">
        <button
          onClick={startConversation}
          disabled={isConnected}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          Stop Conversation
        </button>
      </div>
    </div>
  );
};

export default VoiceConversation;
