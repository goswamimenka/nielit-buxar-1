import React, { useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminLogin(){
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // store token
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', data.email);
      // redirect to admin dashboard (not implemented yet) - go to home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login error');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <div className="grid-background-login"></div>
      <div className="decorative-circle circle-1-login"></div>
      <div className="decorative-circle circle-2-login"></div>

      <button className="back-arrow-btn-login" onClick={() => navigate('/')} title="Go back to home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>

      <div className="login-wrapper">
        <div className="login-header">
          <div className="logo-circle-login">
            <img src="/logo192.png" alt="logo" className="login-logo" />
          </div>
          <h1>Admin Login</h1>
          <p className="login-subtitle">Enter admin credentials to continue</p>
        </div>

        {error && <div className="error-message" style={{marginBottom: '10px'}}>{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group-login">
            <label>Email</label>
            <div className="input-wrapper">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@nielitbuxer" required />
            </div>
          </div>

          <div className="form-group-login">
            <label>Password</label>
            <div className="input-wrapper">
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
          </div>

          <button className="login-submit-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
