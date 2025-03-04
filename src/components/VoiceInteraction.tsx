import React, { useState, useEffect, useRef } from 'react';
import { ElevenLabsClient } from 'elevenlabs';

const ELEVEN_LABS_API_KEY = "sk_94d0eeaaf918868858d040cc05f77b99ceca2033f3528917";
const AGENT_ID = '5gMZf51LYKch9cJeSEiH';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Your voice ID from Eleven Labs

const client = new ElevenLabsClient({ apiKey: ELEVEN_LABS_API_KEY });

const VoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognition.current.onerror = () => {
        console.error('Speech recognition error');
        setIsListening(false);
      };
    }
  }, []);

  const handleUserMessage = async (message: string) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
    setIsListening(false);

    try {
      // Simulate sending a message to the agent
      const agentMessage = { role: 'agent', content: 'This is a simulated response.' };
      setMessages((prevMessages) => [...prevMessages, agentMessage]);

      // Convert agent response to speech
      await generateVoice(agentMessage.content);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const generateVoice = async (text: string) => {
    try {
      const response = await fetch('/api/v1/text-to-speech/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ELEVEN_LABS_API_KEY}`,
        },
        body: JSON.stringify({
          text: text,
          voice_id: VOICE_ID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error generating voice:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      recognition.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Voice Interaction with AI Agent</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}
          >
            <strong>{message.role === 'user' ? 'You:' : 'Agent:'}</strong> {message.content}
          </div>
        ))}
      </div>
      <button
        onClick={toggleListening}
        className={`mt-4 px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default VoiceInteraction;
