import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import nieLitLogo from '../assets/NIELIT.png';
import digitalLogo from '../assets/digital-india-logo-png-8.png';
import emblemLogo from '../assets/emblem.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isAdmin = localStorage.getItem('admin_token');

  // Only show settings on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');
  const shouldShowSettings = isAdmin && isAdminPage;

  const handleProfileClick = () => {
    navigate('/admin/profile');
    setShowProfileMenu(false);
  };

  const handleRegistrationClick = () => {
    navigate('/admin/registrations');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side - NIELIT Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img src={nieLitLogo} alt="NIELIT Buxar Logo" className="nielit-logo" />
        </div>

        {/* Center - NIELIT Full Form */}
        <div className="navbar-content">
          <div className="title-section">
            <h1 className="title-english">National Institute of Electronics &amp; Information Technology, Buxar</h1>
            <p className="title-hindi">Ministry of Electronics &amp; Information Technology, Government of India</p>
          </div>
        </div>

        {/* Right Side - Icons */}
        <div className="navbar-icons">

          <div className="icon-item">
            <img src={emblemLogo} alt="emblem" className="emblem" />
          </div>
          
          <div className="icon-item">
            <img src={digitalLogo} alt="Digital India Logo" className="digital-india-icon" />
          </div>

          {/* Settings Icon with Profile Dropdown - Only show when admin is logged in on admin pages */}
          {shouldShowSettings && (
            <div className="icon-item settings-container">
              <button 
                className="settings-icon-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title="Settings"
              >
                <svg viewBox="0 0 100 100" className="settings-icon">
                  <circle cx="50" cy="50" r="48" fill="#0066CC"/>
                  <circle cx="50" cy="50" r="28" fill="white"/>
                  <circle cx="50" cy="50" r="20" fill="#0066CC"/>
                  <text x="50" y="57" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">⚙</text>
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <button className="profile-menu-item" onClick={handleProfileClick}>
                    <i className="fas fa-user-circle"></i>
                    Profile
                  </button>
                  <button className="profile-menu-item" onClick={handleRegistrationClick}>
                    <i className="fas fa-file-clipboard"></i>
                    Registration Requests
                  </button>
                  <button className="profile-menu-item" onClick={handleLogout} style={{borderTop: '1px solid #e0e0e0', marginTop: '8px', paddingTop: '8px', color: '#d32f2f'}}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
