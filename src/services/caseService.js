import api from './api';

const caseService = {
  getAllCases: async () => {
    try {
      const response = await api.get('/cases');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch cases' };
    }
  },

  getCaseById: async (id) => {
    try {
      const response = await api.get(`/cases/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch case' };
    }
  },

  createCase: async (caseNumber, title, description) => {
    try {
      const response = await api.post('/cases', {
        case_number: caseNumber,
        title,
        description
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create case' };
    }
  },

  updateCase: async (id, title, description) => {
    try {
      const response = await api.put(`/cases/${id}`, {
        title,
        description
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update case' };
    }
  },

  deleteCase: async (id) => {
    try {
      const response = await api.delete(`/cases/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete case' };
    }
  }
};

export default caseService;