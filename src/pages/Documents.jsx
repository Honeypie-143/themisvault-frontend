import React, { useState, useEffect } from 'react';
import documentService from '../services/documentService';
import caseService from '../services/caseService';
import '../styles/Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('contract');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsData, casesData] = await Promise.all([
        documentService.getAllDocuments(),
        caseService.getAllCases()
      ]);
      setDocuments(docsData);
      setCases(casesData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!file || !selectedCaseId) {
      setError('Please select a file and case');
      return;
    }

    try {
      await documentService.uploadDocument(selectedCaseId, file, docType);
      setFile(null);
      setSelectedCaseId('');
      setDocType('contract');
      setShowUpload(false);
      fetchData();
    } catch (err) {
      setError(err.error || 'Failed to upload document');
    }
  };

  const handleDownload = async (docId, filename) => {
    try {
      await documentService.downloadDocument(docId, filename);
    } catch (err) {
      setError('Failed to download document');
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(docId);
        fetchData();
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h1>📄 Legal Documents</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary"
        >
          {showUpload ? 'Cancel' : '⬆️ Upload Document'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showUpload && (
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label>Select Case</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              required
            >
              <option value="">Choose a case...</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.case_number} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="contract">Contract</option>
              <option value="evidence">Evidence</option>
              <option value="agreement">Agreement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>File</label>
            <input
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Upload Document
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length > 0 ? (
        <div className="documents-table">
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Type</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.filename}</td>
                  <td>{doc.doc_type}</td>
                  <td>{doc.uploaded_by}</td>
                  <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleDownload(doc.id, doc.filename)}
                      className="btn-secondary"
                    >
                      ⬇️ Download
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No documents found. Upload your first document!</p>
      )}
    </div>
  );
};

export default Documents;