import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email or Phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const identifier = formData.emailOrPhone.trim();

    if (!identifier) {
      newErrors.emailOrPhone = 'Email or Phone number is required';
    } else {
      if (isAdminLogin) {
          // allow admin alias 'admin', any identifier containing '@' (to support admin@nielitbuxer), or phone
          if (!(identifier.toLowerCase() === 'admin' || identifier.includes('@') || phoneRegex.test(identifier))) {
            newErrors.emailOrPhone = "For admin login enter 'admin' or admin email or phone";
          }
        } else {
          if (!(emailRegex.test(identifier) || phoneRegex.test(identifier))) {
            newErrors.emailOrPhone = 'Please enter a valid email or 10-digit phone number';
          }
        }
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If admin login checkbox enabled, call admin API
      if (isAdminLogin) {
        setSubmitted(true);
        try {
          const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.emailOrPhone, password: formData.password })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            setSubmitted(false);
            setErrors({ form: data.message || 'Admin login failed' });
            return;
          }
          
          // store token and redirect to admin dashboard
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_email', data.email);
          setSubmitted(false);
          navigate('/admin/dashboard');
        } catch (err) {
          setSubmitted(false);
          console.error('Login error:', err);
          setErrors({ form: 'Unable to connect to server. Please try again.' });
        }
        return;
      }

      console.log('Login submitted:', formData);
      setSubmitted(true);
      // Simulate regular user login
      setTimeout(() => {
        setSubmitted(false);
        navigate('/');
      }, 1200);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email/phone');
  };

  return (
    <div className="login-container">
      <div className="grid-background-login"></div>
      <div className="decorative-circle circle-1-login"></div>
      <div className="decorative-circle circle-2-login"></div>

      <button className="back-arrow-btn-login" onClick={() => navigate('/')} title="Go back to home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <div className="login-wrapper">
        <div className="login-header">
          <div className="logo-circle-login">
            <svg viewBox="0 0 100 100" className="login-logo">
              {/* <circle cx="50" cy="50" r="48" fill="none" stroke="#003D82" strokeWidth="2"/>
              <text x="50" y="60" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#003D82">N</text> */}
            </svg>
          </div>
          {/* <h1>NIELIT Buxar</h1> */}
          
        </div>

        {submitted && (
          <div className="success-message-login">
            <div className="success-content-login">
              <span className="success-icon-login">✓</span>
              <p>Login Successful!</p>
              <p className="redirect-text">Redirecting to home...</p>
            </div>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.form && <div className="error-message" style={{marginBottom:8}}>{errors.form}</div>}
          <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
            <input id="adminToggle" type="checkbox" checked={isAdminLogin} onChange={e=>{
              const on = e.target.checked;
              setIsAdminLogin(on);
              // Prefill admin email when toggled on if field is empty or contains non-admin value
              if (on) {
                const current = (formData.emailOrPhone || '').trim();
                if (!current || !(current.toLowerCase() === 'admin' || current.includes('@'))) {
                  setFormData(prev => ({ ...prev, emailOrPhone: 'admin@nielitbuxer' }));
                }
              }
            }} />
            <label htmlFor="adminToggle" style={{fontSize:13, color:'#333', margin:0}}>Admin Login</label>
          </div>
          <div className="form-group-login">
            <label htmlFor="emailOrPhone">Email or Phone Number *</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Enter your email or phone number"
                className={errors.emailOrPhone ? 'input-error' : ''}
              />
            </div>
            {errors.emailOrPhone && <span className="error-message">{errors.emailOrPhone}</span>}
          </div>

          <div className="form-group-login">
            <label htmlFor="password">Password *</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input type="checkbox" name="rememberMe" />
              <span>Remember me</span>
            </label>
            <button type="button" className="forgot-password-link" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-submit-btn">Sign In</button>

          <div className="signup-link">
            <p>Don't have an account? <button type="button" className="signup-btn" onClick={() => navigate('/registration')}>Register here</button></p>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2025 NIELIT Buxar. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
