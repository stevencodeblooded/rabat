import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const forumService = {
  async getAllForums() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/forums`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch forums');
    }
  },

  async getForumThread(forumId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/forums/${forumId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch forum thread');
    }
  },

  async sendMessage(forumId, messageData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/forums/${forumId}/messages`, messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to send message');
    }
  },

  async createForum(forumData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/forums`, forumData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to create forum');
    }
  }
};