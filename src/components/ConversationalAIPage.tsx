import React, { useState, useEffect } from 'react';
import { ElevenLabsClient } from 'elevenlabs'; 

const ELEVEN_LABS_API_KEY = "sk_94d0eeaaf918868858d040cc05f77b99ceca2033f3528917"; 
const AGENT_ID = '5gMZf51LYKch9cJeSEiH'; 

const client = new ElevenLabsClient({ apiKey: ELEVEN_LABS_API_KEY });

const ConversationalAIPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await client.conversationalAi.getConversations({
          agent_id: AGENT_ID,
        });
        setConversations(response.conversations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div>Error loading conversations: {error}</div>;
  }

  return (
    <div>
      <h1>Conversational AI Agent</h1>
      {conversations.length > 0 ? (
        conversations.map((conversation, index) => (
          <div key={index} className="conversation-item">
            <p><strong>Agent Name:</strong> {conversation.agent_name}</p>
            <p><strong>Status:</strong> {conversation.status}</p>
            <p><strong>Message Count:</strong> {conversation.message_count}</p>
            <p><strong>Call Duration:</strong> {conversation.call_duration_secs} seconds</p>
          </div>
        ))
      ) : (
        <div>No conversations found.</div>
      )}
    </div>
  );
};

export default ConversationalAIPage;
