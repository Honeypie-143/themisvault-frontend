import React, { useState, useEffect } from 'react';
import auditService from '../services/auditService';
import '../styles/AuditLogs.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await auditService.getAllAuditLogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'UPLOAD':
        return '⬆️';
      case 'DOWNLOAD':
        return '⬇️';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      default:
        return '📝';
    }
  };

  return (
    <div className="audit-container">
      <div className="audit-header">
        <h1>📊 Audit Logs</h1>
        <p>Complete activity history of all document operations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading audit logs...</p>
      ) : logs.length > 0 ? (
        <div className="audit-table">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Document</th>
                <th>Timestamp</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>
                    <span className="action-badge">
                      {getActionIcon(log.action)} {log.action}
                    </span>
                  </td>
                  <td>{log.user_name || 'Unknown User'}</td>
                  <td>{log.filename || 'N/A'}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    {log.user_id} - Doc ID: {log.document_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No audit logs found.</p>
      )}
    </div>
  );
};

export default AuditLogs;