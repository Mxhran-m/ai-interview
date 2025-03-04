import React, { useState, useEffect } from 'react';
import { Conversation } from '@11labs/client';
import ParticleSwarmLoader from './ui/ParticleSwarmLoader';
import StaggeredFadeLoader from './ui/StaggeredFadeLoader';

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
    <div className="flex flex-col items-center md:p-40 p-20 bg-gray-100 min-h-screen">
      <h1 className="md:text-5xl text-3xl font-bold mb-4 text-center ">Interview with Our Avatar</h1>
      <div className="mb-4">
        <span className={`text-lg ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? 'Connected' : 'press the start button to start interview'}
        </span>
      </div>
      <div className="mb-4">
        <span className="text-lg">Status: {agentStatus}</span>
      </div>
      {isConnected ? <ParticleSwarmLoader/> : <h1 className='h-40 w-full flex items-center justify-center text-blue-400 '><StaggeredFadeLoader/></h1>}
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
