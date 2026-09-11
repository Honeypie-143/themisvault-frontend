import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import caseService from '../services/caseService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    totalDocuments: 0
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await caseService.getAllCases();
      setCases(data);
      setStats({
        totalCases: data.length,
        totalDocuments: data.reduce((sum, c) => sum + (c.documentCount || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👋 Welcome, {user?.name}!</h1>
        <p>Your Secure Legal Document Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📋 Total Cases</h3>
          <p className="stat-value">{stats.totalCases}</p>
        </div>
        <div className="stat-card">
          <h3>📄 Total Documents</h3>
          <p className="stat-value">{stats.totalDocuments}</p>
        </div>
        <div className="stat-card">
          <h3>👤 Role</h3>
          <p className="stat-value">{user?.role}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Cases</h2>
        {loading ? (
          <p>Loading cases...</p>
        ) : cases.length > 0 ? (
          <div className="cases-list">
            {cases.slice(0, 5).map(c => (
              <div key={c.id} className="case-item">
                <h3>{c.title}</h3>
                <p>Case #: {c.case_number}</p>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No cases found. Create your first case!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;