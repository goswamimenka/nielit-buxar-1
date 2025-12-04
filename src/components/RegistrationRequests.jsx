import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function RegistrationRequests() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchRegs = async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('http://localhost:5000/api/admin/registrations', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegs(); }, []);

  // Filter registrations based on status
  const filteredRegistrations = filter === 'all' 
    ? registrations 
    : registrations.filter(r => (r.status || 'pending').toLowerCase() === filter.toLowerCase());

  const handleViewDetails = (reg) => {
    setSelectedDetails(reg);
    setShowDetailsModal(true);
  };

  const handleAccept = async (regId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:5000/api/admin/registrations/${regId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'accepted' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      
      // Update local state
      setRegistrations(registrations.map(r => 
        r._id === regId ? { ...r, status: 'accepted' } : r
      ));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async (regId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:5000/api/admin/registrations/${regId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      
      // Update local state
      setRegistrations(registrations.map(r => 
        r._id === regId ? { ...r, status: 'rejected' } : r
      ));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{minHeight:'100vh', paddingBottom: '100px'}}>
      <div className="grid-background-login"></div>
      <div style={{padding: '0px 20px 40px'}}>
         {/* Back Arrow */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              marginBottom: 10,
              background: 'rgba(0, 61, 130, 0.1)',
              border: '2px solid rgba(0, 61, 130, 0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
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

        <div style={{maxWidth:1200, margin:'0 auto'}}>
          {/* Back Arrow */}
          {/* <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              marginBottom: 24,
              background: 'rgba(0, 61, 130, 0.1)',
              border: '2px solid rgba(0, 61, 130, 0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
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

          {/* Header */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
            <h1 style={{margin:0, fontSize:'28px', color:'#003D82'}}>📋 Registration Requests</h1>
            <button 
              onClick={fetchRegs}
              style={{
                padding: '10px 20px',
                background: '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Refresh
            </button>
          </div>

          {/* Filter Dropdown */}
          <div style={{marginBottom: 24}}>
            <label style={{marginRight: 12, fontWeight: 600, color: '#333'}}>Filter by:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid rgba(0, 102, 204, 0.3)',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: 'white',
                color: '#003D82',
                cursor: 'pointer',
                minWidth: 150
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading && <p style={{textAlign:'center'}}>Loading registrations...</p>}
          {error && <div style={{color:'#d32f2f', padding:12, marginBottom:16, background:'#ffebee', borderRadius:8}}>{error}</div>}

          {/* No Requests State */}
          {filteredRegistrations.length === 0 && !loading && (
            <div style={{
              textAlign:'center',
              padding:'80px 20px',
              background:'rgba(200, 200, 200, 0.1)',
              borderRadius:12
            }}>
              <div style={{fontSize:60, marginBottom:16}}>📋</div>
              <h3 style={{margin:'0 0 8px', color:'#666'}}>No {filter !== 'all' ? filter : 'pending'} requests</h3>
              <p style={{margin:0, color:'#999'}}>All registration requests have been processed</p>
            </div>
          )}

          {/* Registration Cards Grid */}
          {!loading && filteredRegistrations.length > 0 && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))', gap:20}}>
              {filteredRegistrations.map(r => {
                const status = r.status || 'pending';
                const statusColor = status === 'accepted' ? '#28a745' : status === 'rejected' ? '#d32f2f' : '#ffc107';
                const statusLabel = status === 'accepted' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending';
                
                return (
                  <div key={r._id} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid rgba(0, 102, 204, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: statusColor,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {statusLabel}
                    </div>

                    {/* Card Content */}
                    <div style={{paddingRight: 60}}>
                      <h3 style={{margin: '0 0 12px', color: '#003D82', fontSize: '18px', fontWeight: 700}}>
                        {r.name}
                      </h3>
                      
                      <div style={{marginBottom: 12}}>
                        <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>COURSE</p>
                        <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{r.highestQualification || '-'}</p>
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12}}>
                        <div>
                          <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>MOBILE</p>
                          <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{r.mobile}</p>
                        </div>
                        <div>
                          <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>EMAIL</p>
                          <p style={{margin: 0, fontSize: '14px', color: '#333', wordBreak: 'break-all'}}>{r.email}</p>
                        </div>
                      </div>

                      <div style={{marginBottom: 16}}>
                        <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>DOB</p>
                        <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{r.dateOfBirth}</p>
                      </div>

                      {/* Action Buttons */}
                      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                        <button
                          onClick={() => handleViewDetails(r)}
                          style={{
                            padding: '10px 16px',
                            background: '#0066CC',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#003D82'}
                          onMouseLeave={(e) => e.target.style.background = '#0066CC'}
                        >
                          👁️ View Details
                        </button>

                        {/* Accept/Reject Buttons - Only show if pending */}
                        {(r.status === 'pending' || !r.status) && (
                          <div style={{display: 'flex', gap: 12}}>
                            <button
                              onClick={() => handleAccept(r._id)}
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                background: '#e8f5e9',
                                color: '#28a745',
                                border: '2px solid #28a745',
                                borderRadius: 6,
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#28a745';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#e8f5e9';
                                e.target.style.color = '#28a745';
                              }}
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleReject(r._id)}
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                background: '#ffebee',
                                color: '#d32f2f',
                                border: '2px solid #d32f2f',
                                borderRadius: 6,
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#d32f2f';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#ffebee';
                                e.target.style.color = '#d32f2f';
                              }}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          style={{
                            padding: '10px 14px',
                            background: '#ffebee',
                            color: '#d32f2f',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#ffcdd2'}
                          onMouseLeave={(e) => e.target.style.background = '#ffebee'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Details Modal */}
          {showDetailsModal && selectedDetails && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowDetailsModal(false)}>
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: 32,
                maxWidth: 600,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                  <h2 style={{margin: 0, color: '#003D82'}}>Full Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 24,
                      cursor: 'pointer',
                      color: '#999'
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{display: 'grid', gap: 16}}>
                  <div>
                    <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>NAME</p>
                    <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.name}</p>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>MOBILE</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.mobile}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>EMAIL</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.email}</p>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>DOB</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.dateOfBirth}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>GENDER</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.gender || '-'}</p>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>QUALIFICATION</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.highestQualification || '-'}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>AADHAR</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.aadhar || '-'}</p>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>CATEGORY</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.category}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>PINCODE</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.pincode || '-'}</p>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>STATE</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.state || '-'}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>DISTRICT</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.district || '-'}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>POST OFFICE</p>
                      <p style={{margin: 0, fontSize: '14px', color: '#333'}}>{selectedDetails.postOffice || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <p style={{margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#666'}}>ADDRESS</p>
                    <p style={{margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6'}}>{selectedDetails.address || '-'}</p>
                  </div>

                  {/* Documents */}
                  <div style={{borderTop: '1px solid #e0e0e0', paddingTop: 16}}>
                    <p style={{margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#666'}}>DOCUMENTS</p>
                    <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                      {selectedDetails.files && selectedDetails.files.photo && (
                        <a href={`http://localhost:5000/${selectedDetails.files.photo.replace(/^\.\//, '')}`} target="_blank" rel="noreferrer" style={{
                          padding: '10px 16px',
                          background: '#E8F4FF',
                          color: '#0066CC',
                          border: '1px solid rgba(0, 102, 204, 0.3)',
                          borderRadius: 6,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>📷 Photo</a>
                      )}
                      {selectedDetails.files && selectedDetails.files.marksheet && (
                        <a href={`http://localhost:5000/${selectedDetails.files.marksheet.replace(/^\.\//, '')}`} target="_blank" rel="noreferrer" style={{
                          padding: '10px 16px',
                          background: '#E8F4FF',
                          color: '#0066CC',
                          border: '1px solid rgba(0, 102, 204, 0.3)',
                          borderRadius: 6,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>📄 Marksheet</a>
                      )}
                      {selectedDetails.files && selectedDetails.files.idProof && (
                        <a href={`http://localhost:5000/${selectedDetails.files.idProof.replace(/^\.\//, '')}`} target="_blank" rel="noreferrer" style={{
                          padding: '10px 16px',
                          background: '#E8F4FF',
                          color: '#0066CC',
                          border: '1px solid rgba(0, 102, 204, 0.3)',
                          borderRadius: 6,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>🆔 ID Proof</a>
                      )}
                      {selectedDetails.files && selectedDetails.files.casteCertificate && (
                        <a href={`http://localhost:5000/${selectedDetails.files.casteCertificate.replace(/^\.\//, '')}`} target="_blank" rel="noreferrer" style={{
                          padding: '10px 16px',
                          background: '#E8F4FF',
                          color: '#0066CC',
                          border: '1px solid rgba(0, 102, 204, 0.3)',
                          borderRadius: 6,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>📜 Caste Cert</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
