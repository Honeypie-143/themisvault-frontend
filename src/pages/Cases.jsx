import React, { useState, useEffect } from 'react';
import caseService from '../services/caseService';
import '../styles/Cases.css';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    case_number: '',
    title: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await caseService.getAllCases();
      setCases(data);
    } catch (err) {
      setError('Failed to fetch cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await caseService.updateCase(
          editingId,
          formData.title,
          formData.description
        );
      } else {
        await caseService.createCase(
          formData.case_number,
          formData.title,
          formData.description
        );
      }

      setFormData({ case_number: '', title: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchCases();
    } catch (err) {
      setError(err.error || 'Failed to save case');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await caseService.deleteCase(id);
        fetchCases();
      } catch (err) {
        setError('Failed to delete case');
      }
    }
  };

  const handleEdit = (caseItem) => {
    setFormData({
      case_number: caseItem.case_number,
      title: caseItem.title,
      description: caseItem.description
    });
    setEditingId(caseItem.id);
    setShowForm(true);
  };

  return (
    <div className="cases-container">
      <div className="cases-header">
        <h1>📋 Legal Cases</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ case_number: '', title: '', description: '' });
          }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Case'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="case-form">
          <div className="form-group">
            <label>Case Number</label>
            <input
              type="text"
              name="case_number"
              value={formData.case_number}
              onChange={handleChange}
              placeholder="e.g., CASE-2024-001"
              disabled={editingId}
              required
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Case title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Case description"
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Case' : 'Create Case'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading cases...</p>
      ) : cases.length > 0 ? (
        <div className="cases-grid">
          {cases.map(c => (
            <div key={c.id} className="case-card">
              <h3>{c.title}</h3>
              <p className="case-number">Case #: {c.case_number}</p>
              <p className="case-description">{c.description}</p>
              <div className="case-actions">
                <button
                  onClick={() => handleEdit(c)}
                  className="btn-secondary"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No cases found. Create your first case!</p>
      )}
    </div>
  );
};

export default Cases;