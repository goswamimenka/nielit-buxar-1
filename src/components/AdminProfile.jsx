import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: 'admin@nielitbuxer',
    name: 'Jeetendra Kumar Singh',
    designation: 'Director',
    mobile: '8986020610',
    email: 'jksingh@nielit.gov.in'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({...profile});
  const email = localStorage.getItem('admin_email');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('Not authenticated');
      
      const res = await fetch('http://localhost:5000/api/admin/profile', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      
      setProfile(data.profile || {
        username: email,
        name: '',
        designation: '',
        mobile: '',
        email: email
      });
      setFormData(data.profile || {
        username: email,
        name: '',
        designation: '',
        mobile: '',
        email: email
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Set defaults if fetch fails
      setProfile({
        username: email,
        name: '',
        designation: '',
        mobile: '',
        email: email
      });
      setFormData({
        username: email,
        name: '',
        designation: '',
        mobile: '',
        email: email
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      
      setProfile(data.profile);
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="grid-background-login"></div>
      <div style={{ padding: '0px 20px 40px' }}>
        {/* Back Arrow on Left */}
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(0, 61, 130, 0.1)',
              border: '2px solid rgba(0, 61, 130, 0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
              fontSize: '24px',
              color: '#003D82',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 61, 130, 0.2)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 61, 130, 0.1)';
              e.target.style.transform = 'scale(1)';
            }}
            title="Back to Dashboard"
          >
            ←
          </button>

        <div style={{ maxWidth: 600, margin: '-71px auto' }}>
          {/* Back Arrow on Left
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(0, 61, 130, 0.1)',
              border: '2px solid rgba(0, 61, 130, 0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
              fontSize: '24px',
              color: '#003D82',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 61, 130, 0.2)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 61, 130, 0.1)';
              e.target.style.transform = 'scale(1)';
            }}
            title="Back to Dashboard"
          >
            ←
          </button> */}

          {/* Profile Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(0, 61, 130, 0.15)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 61, 130, 0.1)'
          }}>
            <div>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                  width: 100,
                  height: 100,
                  // background: 'linear-gradient(135deg, #0066CC 0%, #003D82 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // fontSize: 48,
                  color: 'white',
                  backgroundImage:'url(../assets/NIELIT.png)',
                  backgroundSize:'cover',
                  backgroundPosition:'center'
                }}>
                  {/* 👤 */}
                </div>
                <h2 style={{ margin: '0 0 8px', color: '#003D82', fontSize: '24px' }}>Admin Profile</h2>
              </div>

              {error && <div style={{ color: '#d32f2f', padding: 12, marginBottom: 16, background: '#ffebee', borderRadius: 8 }}>{error}</div>}
              {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

              {!loading && (
              <div>
                <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!editing}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid rgba(0, 61, 130, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: editing ? '#fff' : 'rgba(0, 61, 130, 0.05)',
                        cursor: editing ? 'text' : 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid rgba(0, 61, 130, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: editing ? '#fff' : 'rgba(0, 61, 130, 0.05)',
                        cursor: editing ? 'text' : 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid rgba(0, 61, 130, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: editing ? '#fff' : 'rgba(0, 61, 130, 0.05)',
                        cursor: editing ? 'text' : 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="e.g. Director"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid rgba(0, 61, 130, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: editing ? '#fff' : 'rgba(0, 61, 130, 0.05)',
                        cursor: editing ? 'text' : 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="10-digit phone number"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid rgba(0, 61, 130, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: editing ? '#fff' : 'rgba(0, 61, 130, 0.05)',
                        cursor: editing ? 'text' : 'not-allowed'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #0066CC 0%, #003D82 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      ✏️ Edit Details
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        style={{
                          padding: '12px 32px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ✓ Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData({ ...profile });
                        }}
                        style={{
                          padding: '12px 32px',
                          background: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
