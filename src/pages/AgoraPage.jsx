import React, { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  SearchIcon,
  ChatAltIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";
import { useDebounce } from "../hooks/useDebounce";
import { notificationService } from "../services/notificationService";

// Topic Creation Modal
const CreateTopicModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, category });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create New Discussion Topic</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic Title"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the discussion topic"
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="general">General</option>
            <option value="urban-planning">Urban Planning</option>
            <option value="community">Community</option>
            <option value="environment">Environment</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rabat-primary-500 text-white rounded-md hover:bg-rabat-primary-600"
            >
              Create Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Topic List Item Component
const TopicListItem = ({ topic, onSelect }) => (
  <div
    onClick={() => onSelect(topic)}
    className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
      <span className="text-sm text-rabat-primary-500 capitalize">
        {topic.category}
      </span>
    </div>
    <p className="text-gray-600 mb-2">{topic.description.slice(0, 150)}...</p>
    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>
        Started by{" "}
        <span className="text-sm text-rabat-primary-500 capitalize">
          {topic.creator?.name || "Anonymous"}
        </span>
      </span>
      <div className="flex items-center space-x-2">
        <ChatAltIcon className="h-5 w-5" />
        <span>{topic.messages?.length || 0} Comments</span>
      </div>
    </div>
  </div>
);

// Discussion Thread Component
const DiscussionThread = ({ topic, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Update the API endpoint to match the new backend route
        const response = await apiClient.get(`/forums/${topic._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
        notificationService.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, [topic._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    try {
      const response = await apiClient.post(`/forums/${topic._id}/messages`, {
        content: newMessage
      });
  
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      // More detailed error logging
      console.error('Failed to send message', error.response?.data || error.message);
      
      // Optional: Add user-friendly error notification
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      notificationService.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      <div className="bg-rabat-primary-50 p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{topic.title}</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          Close
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.author.id === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl p-3 rounded-lg ${
                message.author.id === user.id
                  ? "bg-rabat-primary-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <div className="text-xs mt-1 opacity-75">
                {message.author.name} |{" "}
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="bg-white p-4 border-t flex items-center space-x-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-3 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-rabat-primary-500 text-white px-4 py-2 rounded-md hover:bg-rabat-primary-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

const AgoraPage = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { user } = useAuth();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await apiClient.get("/forums");
        setTopics(response.data);
        setFilteredTopics(response.data);
      } catch (error) {
        console.error("Failed to fetch topics", error);
        notificationService.error("Failed to fetch topics", error);

      }
    };

    fetchTopics();
  }, []);

  // Filter topics
  useEffect(() => {
    let result = topics;

    // Search filter
    if (debouncedSearchTerm) {
      result = result.filter(
        (topic) =>
          topic.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          topic.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((topic) => topic.category === categoryFilter);
    }

    setFilteredTopics(result);
  }, [debouncedSearchTerm, categoryFilter, topics]);

  const createTopic = async (topicData) => {
    try {
      const response = await apiClient.post("/forums", {
        title: topicData.title,
        description: topicData.description,
        category: topicData.category,
      });
      setTopics((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Failed to create topic", error);
      notificationService.error("Failed to create topic", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-rabat-primary-500 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Agora - Urban Discussions</h1>
          <p className="text-white/80 mt-2">
            Collaborate, share ideas, and shape the future of Rabat
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        {/* Sidebar Filters */}
        <div className="hidden md:block bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>
          <div className="space-y-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="urban-planning">Urban Planning</option>
              <option value="community">Community</option>
              <option value="environment">Environment</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Topics List */}
        <div className="md:col-span-2 space-y-4">
          {/* Search and Create Controls */}
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussions..."
                className="w-full px-4 py-2 border rounded-md pl-10"
              />
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {user && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-rabat-primary-500 text-white px-4 py-2 rounded-md hover:bg-rabat-primary-600 flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Topic
              </button>
            )}
          </div>

          {/* Topics List */}
          {filteredTopics.map((topic) => (
            <TopicListItem
              key={topic._id}
              topic={topic}
              onSelect={setSelectedTopic}
            />
          ))}

          {filteredTopics.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No topics found. Try a different search or filter.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createTopic}
      />

      {selectedTopic && (
        <DiscussionThread
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </div>
  );
};

export default AgoraPage;
