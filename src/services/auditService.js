import api from './api';

const auditService = {
  getAllAuditLogs: async () => {
    try {
      const response = await api.get('/auditLogs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch audit logs' };
    }
  },

  getUserAuditLogs: async (userId) => {
    try {
      const response = await api.get(`/auditLogs/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user audit logs' };
    }
  },

  getDocumentAuditLogs: async (documentId) => {
    try {
      const response = await api.get(`/auditLogs/document/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch document audit logs' };
    }
  }
};

export default auditService;