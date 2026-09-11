import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🔐 ThemisVault</h1>
          <p>Secure Digital Document Management</p>
        </div>

        <div className="navbar-links">
          {user && (
            <>
              <a href="/dashboard">Dashboard</a>
              <a href="/cases">Cases</a>
              <a href="/documents">Documents</a>
              <a href="/audit-logs">Audit Logs</a>
            </>
          )}
        </div>

        <div className="navbar-user">
          {user && (
            <>
              <span>{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;