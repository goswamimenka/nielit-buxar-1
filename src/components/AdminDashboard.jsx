import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminDashboard(){
  const navigate = useNavigate();
  const email = localStorage.getItem('admin_email');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  useEffect(() => {
    // Define an asynchronous function inside useEffect
    const fetchData = async () => {
    
        const response = await fetch('https://jsonplaceholder.typicode.com/users'); // Replace with your API endpoint
        console.log('Response status:', response);


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        //setData(result);
      console.log('Fetched data:', result);
    };

    fetchData(result);
  }, []); 

  return (
    <div style={{minHeight:'100vh'}}>
      <div className="grid-background-login"></div>
      <div style={{padding: '90px 20px 40px'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 , marginLeft:412}}>
            <div>
              <h2 style={{margin:10}}>Admin Dashboard</h2>
              {/* <p style={{margin:0}}>Signed in as <strong>{email}</strong></p> */}
            </div>
          </div>

          {/* Dashboard Welcome Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 107, 17, 0.62) 0%, rgba(77, 184, 255, 0.1) 100%)',
            border: '2px solid rgba(0, 102, 204, 0.2)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            marginBottom: 32
          }}>
            <h3 style={{ margin: '0 0 12px', color: '#003D82', fontSize: '24px' }}>Teacher Management</h3>
            <p style={{ margin: 0, color: '#666', fontSize: 16 }}>Manage registrations and view submitted applications</p>
            <button 
              onClick={() => navigate('/admin/registrations')}
              style={{
                marginTop: 20,
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
              View Registration Requests →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
