import apiClient from './apiClient';

export const contributionService = {
  async createContribution(contributionData) {
    try {
      const response = await apiClient.post('/contributions', contributionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to create contribution');
    }
  },

  async getContributions(filters = {}) {
    try {
      const response = await apiClient.get('/contributions', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch contributions');
    }
  }
};