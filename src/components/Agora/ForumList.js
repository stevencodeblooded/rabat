import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forumService } from '../../services/forumService';

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const fetchedForums = await forumService.getAllForums();
        setForums(fetchedForums);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch forums:', error);
        setIsLoading(false);
      }
    };

    fetchForums();
  }, []);

  if (isLoading) {
    return <div>Loading forums...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Urban Discussions</h1>
      {forums.map(forum => (
        <div 
          key={forum.id} 
          className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow"
        >
          <Link to={`/forum/${forum.id}`}>
            <h2 className="text-xl font-semibold text-gray-800">{forum.title}</h2>
            <p className="text-gray-600 mt-2">{forum.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {forum.topicCount} Topics | {forum.memberCount} Members
              </span>
              <span className="text-sm text-blue-600 hover:underline">
                Join Discussion
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ForumList;