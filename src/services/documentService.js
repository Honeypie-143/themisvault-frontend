import api from './api';

const documentService = {
  getAllDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch documents' };
    }
  },

  getDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch document' };
    }
  },

  getDocumentsByCase: async (caseId) => {
    try {
      const response = await api.get(`/documents/case/${caseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch case documents' };
    }
  },

  uploadDocument: async (caseId, file, docType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', caseId);
      formData.append('doc_type', docType);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to upload document' };
    }
  },

  downloadDocument: async (id, filename) => {
    try {
      const response = await api.get(`/documents/download/${id}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'document');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Failed to download document' };
    }
  },

  updateDocument: async (id, filename, docType) => {
    try {
      const response = await api.put(`/documents/${id}`, {
        filename,
        doc_type: docType
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update document' };
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete document' };
    }
  }
};

export default documentService;