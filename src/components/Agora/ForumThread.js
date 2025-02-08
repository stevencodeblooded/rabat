import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { forumService } from '../../services/forumService';
import { useAuth } from '../../context/AuthContext';

const ForumThread = () => {
  const { forumId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const threadData = await forumService.getForumThread(forumId);
        setThread(threadData);
        setMessages(threadData.messages);
      } catch (error) {
        console.error('Failed to fetch thread:', error);
      }
    };

    fetchThreadDetails();
  }, [forumId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await forumService.sendMessage(forumId, {
        content: newMessage,
        userId: user.id
      });

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!thread) {
    return <div>Loading thread...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{thread.title}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className="mb-4 pb-4 border-b last:border-b-0"
          >
            <div className="flex items-center mb-2">
              <img 
                src={message.user.avatar} 
                alt={message.user.name} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-semibold">{message.user.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-800">{message.content}</p>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSendMessage} className="mt-6">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
          <button 
            type="submit" 
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ForumThread;