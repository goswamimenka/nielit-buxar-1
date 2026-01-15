import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

// Comprehensive pincode database for Indian states/districts
const pincodeDatabase = {
  // Delhi
  '110001': { state: 'Delhi', district: 'New Delhi', postOffices: ['Delhi Central', 'RK Puram', 'Rajendra Place'] },
  '110002': { state: 'Delhi', district: 'New Delhi', postOffices: ['Ashoka Road', 'Rashtrapati Bhawan', 'New Delhi'] },
  '110019': { state: 'Delhi', district: 'New Delhi', postOffices: ['Lajpat Nagar', 'Safdarjung', 'Dhaula Kuan'] },
  '110024': { state: 'Delhi', district: 'South Delhi', postOffices: ['Malviya Nagar', 'Mehrauli', 'Chattarpur'] },
  '110092': { state: 'Delhi', district: 'East Delhi', postOffices: ['Laxmi Nagar', 'Preet Vihar', 'Shahdara'] },
  '110096': { state: 'Delhi', district: 'East Delhi', postOffices: ['IP Extension', 'Vivek Vihar', 'Mayur Vihar'] },
  
  // Karnataka
  '560001': { state: 'Karnataka', district: 'Bengaluru', postOffices: ['Bangalore City', 'Shivajinagar', 'Cubbon Park'] },
  '560009': { state: 'Karnataka', district: 'Bengaluru', postOffices: ['Indiranagar', 'Koramangala', 'Frazer Town'] },
  '560034': { state: 'Karnataka', district: 'Bengaluru', postOffices: ['Whitefield', 'Marathahalli', 'Brookfield'] },
  '560076': { state: 'Karnataka', district: 'Bengaluru', postOffices: ['Bannerghatta', 'HSR Layout', 'Sarjapur'] },
  '570001': { state: 'Karnataka', district: 'Mysuru', postOffices: ['Mysore City', 'Jayalakshmipuram', 'V V Puram'] },
  '575001': { state: 'Karnataka', district: 'Mangaluru', postOffices: ['Mangalore City', 'Kadri', 'Someshwara'] },
  
  // Maharashtra
  '400001': { state: 'Maharashtra', district: 'Mumbai', postOffices: ['Mumbai City', 'Fort', 'Colaba'] },
  '400002': { state: 'Maharashtra', district: 'Mumbai', postOffices: ['Mumbai Central', 'Kala Ghoda', 'Dhobi Talao'] },
  '400005': { state: 'Maharashtra', district: 'Mumbai', postOffices: ['Girgaum', 'Bhuleshwar', 'Khetwadi'] },
  '400051': { state: 'Maharashtra', district: 'Mumbai', postOffices: ['Mahim', 'Bandra', 'Worli'] },
  '400077': { state: 'Maharashtra', district: 'Mumbai', postOffices: ['Powai', 'Chandivali', 'Hiranandani'] },
  '411001': { state: 'Maharashtra', district: 'Pune', postOffices: ['Pune City', 'Camp', 'Shaniwar Peth'] },
  
  // West Bengal
  '700001': { state: 'West Bengal', district: 'Kolkata', postOffices: ['Kolkata City', 'Esplanade', 'BBD Bagh'] },
  '700012': { state: 'West Bengal', district: 'Kolkata', postOffices: ['Park Street', 'South City', 'Ballygunj'] },
  '700019': { state: 'West Bengal', district: 'Kolkata', postOffices: ['Kalighat', 'Nakhoda', 'Manicktala'] },
  '700061': { state: 'West Bengal', district: 'Kolkata', postOffices: ['Jadavpur', 'Lake Market', 'Gariahat'] },
  
  // Uttar Pradesh
  '201301': { state: 'Uttar Pradesh', district: 'Gautam Budh Nagar', postOffices: ['Noida City', 'Sector 18', 'Sector 62'] },
  '201309': { state: 'Uttar Pradesh', district: 'Gautam Budh Nagar', postOffices: ['Noida Sector', 'Ecotech Extn', 'Knowledge Park'] },
  '226001': { state: 'Uttar Pradesh', district: 'Lucknow', postOffices: ['Lucknow City', 'Aliganj', 'Hazratganj'] },
  '226005': { state: 'Uttar Pradesh', district: 'Lucknow', postOffices: ['Charbagh', 'Hazratganj', 'Aminabad'] },
  '282001': { state: 'Uttar Pradesh', district: 'Agra', postOffices: ['Agra City', 'Naubasta', 'Fatehabad'] },
  
  // Haryana
  '122001': { state: 'Haryana', district: 'Faridabad', postOffices: ['Faridabad City', 'Sector 4', 'Sector 7'] },
  '121001': { state: 'Haryana', district: 'Panchkula', postOffices: ['Panchkula City', 'Sector 4', 'Sector 5'] },
  '131001': { state: 'Haryana', district: 'Hisar', postOffices: ['Hisar City', 'Sector 11', 'Sector 13'] },
  
  // Telangana
  '500001': { state: 'Telangana', district: 'Hyderabad', postOffices: ['Hyderabad City', 'Secunderabad', 'Charminar'] },
  '500081': { state: 'Telangana', district: 'Hyderabad', postOffices: ['Banjara Hills', 'Kondapur', 'Gachibowli'] },
  '500016': { state: 'Telangana', district: 'Hyderabad', postOffices: ['Somajiguda', 'Hitec City', 'Jubilee Hills'] },
  
  // Punjab
  '140001': { state: 'Punjab', district: 'Chandigarh', postOffices: ['Chandigarh City', 'Sector 17', 'Sector 22'] },
  '160001': { state: 'Punjab', district: 'Amritsar', postOffices: ['Amritsar City', 'Golden Temple', 'Rambagh'] },
  '140301': { state: 'Punjab', district: 'Mohali', postOffices: ['Mohali City', 'Sector 67', 'Sector 76'] },
  
  // Gujarat
  '380001': { state: 'Gujarat', district: 'Ahmedabad', postOffices: ['Ahmedabad City', 'Lal Darwaza', 'Khanpur'] },
  '380006': { state: 'Gujarat', district: 'Ahmedabad', postOffices: ['Navrangpura', 'Bodakdev', 'Mithakhali'] },
  '360001': { state: 'Gujarat', district: 'Rajkot', postOffices: ['Rajkot City', 'Kalavad Road', 'Alfred High School'] },
  
  // Madhya Pradesh
  '451001': { state: 'Madhya Pradesh', district: 'Indore', postOffices: ['Indore City', 'Bhanwarkuwa', 'Sukhliya'] },
  '450001': { state: 'Madhya Pradesh', district: 'Bhopal', postOffices: ['Bhopal City', 'Arera Colony', 'Jawahar Lal Nehru'] },
  
  // Bihar
  '800001': { state: 'Bihar', district: 'Patna', postOffices: ['Patna City', 'Fraser Road', 'Boring Road'] },
  '803101': { state: 'Bihar', district: 'Patna', postOffices: ['Phulwari Sharif', 'Mokama', 'Barh'] },
  
  // Rajasthan
  '302001': { state: 'Rajasthan', district: 'Jaipur', postOffices: ['Jaipur City', 'C Scheme', 'Tonk Road'] },
  '302019': { state: 'Rajasthan', district: 'Jaipur', postOffices: ['Ajmeri Gate', 'Bapu Bazaar', 'Sanganeri Gate'] },
  '345001': { state: 'Rajasthan', district: 'Barmer', postOffices: ['Barmer City', 'Shiv Colony', 'Fort Road'] },
  
  // Andhra Pradesh
  '530001': { state: 'Andhra Pradesh', district: 'Visakhapatnam', postOffices: ['Visakhapatnam City', 'Dwarakanagar', 'Gajuwaka'] },
  '500482': { state: 'Andhra Pradesh', district: 'Tirupati', postOffices: ['Tirupati City', 'Karakambadi Road', 'Chintalpet'] }
};

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    aadhar: '',
    highestQualification: '',
    pincode: '',
    state: '',
    district: '',
    postOffice: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male',
    category: 'General',
  });
  const [documents, setDocuments] = useState({
    photo: null,
    marksheet: null,
    idProof: null,
    casteCertificate: null
  });
  const [postOfficeOptions, setPostOfficeOptions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Auto-fill state, district, and post office options when pincode is entered
    if (name === 'pincode' && value.length === 6) {
      const data = pincodeDatabase[value];
      if (data) {
        setForm(prev => ({
          ...prev,
          state: data.state,
          district: data.district,
          postOffice: ''
        }));
        setPostOfficeOptions(data.postOffices);
      } else {
        setMsg({ type: 'warning', text: 'Pincode not found in our database. Please enter details manually.' });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
        setPostOfficeOptions([]);
      }
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const f = files && files[0] ? files[0] : null;
    if (!f) return;
    
    if (name === 'photo') {
      // Allow image formats
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(f.type)) {
        setMsg({ type: 'error', text: 'Photo must be JPG, PNG, GIF, or WebP.' });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
        return;
      }
      if (f.size > 500 * 1024) {
        setMsg({ type: 'error', text: 'Photo must be 500KB or less.' });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
        return;
      }
    } else {
      // Allow PDF or image formats for documents
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(f.type)) {
        setMsg({ type: 'error', text: 'Please upload PDF or image files only.' });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        setMsg({ type: 'error', text: 'Each file must be 2MB or less.' });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
        return;
      }
    }
    setDocuments(prev => ({ ...prev, [name]: f }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.mobile || !form.dateOfBirth) {
      setMsg({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    if (!documents.marksheet || !documents.idProof) {
      setMsg({ type: 'error', text: 'Please upload marksheet and ID proof' });
      return;
    }

    const needsCaste = ['SC','ST','EWS'].includes(String(form.category).toUpperCase());
    if (needsCaste && !documents.casteCertificate) {
      setMsg({ type: 'error', text: 'Caste Certificate is required for selected category' });
      return;
    }

    // Prepare FormData and send to backend API
    const fd = new FormData();
    Object.keys(form).forEach(k => {
      // ensure non-empty values are appended
      fd.append(k, form[k] ?? '');
    });
    if (documents.photo) fd.append('photo', documents.photo);
    if (documents.marksheet) fd.append('marksheet', documents.marksheet);
    if (documents.idProof) fd.append('idProof', documents.idProof);
    if (documents.casteCertificate) fd.append('casteCertificate', documents.casteCertificate);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: fd
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Server error');

      setMsg({ type: 'success', text: result.message || 'Registration submitted successfully!' });
      setShowSuccessModal(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Submit error:', err);
      setMsg({ type: 'error', text: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="grid-background-reg"></div>
      
      <button className="back-btn" onClick={() => navigate('/')} title="Go back">
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="registration-container">
        <div className="registration-card">
          <div className="card-header">
            <h2><i className="fas fa-user-circle"></i> Teacher Registration</h2>
          </div>

          {msg.text && (
            <div className={`alert alert-${msg.type === 'error' ? 'danger' : 'success'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Row 1 */}
              <div className="form-group">
                <label><i className="fas fa-user"></i> Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter student's full name"
                  required 
                />
              </div>
              
              {/* <div className="form-group">
                <label><i className="fas fa-user"></i> Father's Name *</label>
                <input 
                  type="text" 
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter father's name"
                  required 
                />
              </div> */}

              {/* Row 2
              <div className="form-group">
                <label><i className="fas fa-user"></i> Mother's Name *</label>
                <input 
                  type="text" 
                  name="motherName"
                  value={form.motherName}
                  onChange={handleInputChange}
                  placeholder="Enter mother's name"
                  required 
                />
              </div> */}

              <div className="form-group">
                <label><i className="fas fa-phone"></i> Mobile Number *</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={form.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  required 
                />
              </div>

              {/* Row 3 */}
              <div className="form-group">
                <label><i className="fas fa-whatsapp"></i> WhatsApp Number</label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp number"
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-envelope"></i> Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required 
                />
              </div>

              {/* Row 4 */}
              <div className="form-group">
                <label><i className="fas fa-calendar"></i> Date of Birth * </label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleInputChange}
                  required 
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-venus-mars"></i> Gender *</label>
                <select 
                  name="gender"
                  value={form.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label><i className="fas fa-map-pin"></i> Pincode *</label>
                <input 
                  type="text" 
                  name="pincode"
                  value={form.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                />
              </div>

              {/* Row 5 */}
              <div className="form-group">
                <label><i className="fas fa-map"></i> State</label>
                <input 
                  type="text" 
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from pincode"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-city"></i> City/District</label>
                <input 
                  type="text" 
                  name="district"
                  value={form.district}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from pincode"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-home"></i> Post Office</label>
                <select 
                  name="postOffice"
                  value={form.postOffice}
                  onChange={handleInputChange}
                >
                  <option value="">{postOfficeOptions.length > 0 ? 'Select Post Office' : 'Enter pincode to load options'}</option>
                  {postOfficeOptions.map((po, idx) => (
                    <option key={idx} value={po}>{po}</option>
                  ))}
                </select>
              </div>

              {/* Row 6 - Full Width */}
              <div className="form-group full-width">
                <label><i className="fas fa-home"></i> Complete Address *</label>
                <textarea 
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="House/Street, Landmark, Area (max 20 words)"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label><i className="fas fa-list"></i> Category *</label>
                <select 
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="General">Select Category</option>
                  <option value="General">General</option>
                  <option value="EWS">EWS</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                </select>
              </div>

              {/* Row 7 - (APAAR Id & Course removed as requested) */}

              {/* Row 8 */}
              <div className="form-group">
                <label><i className="fas fa-id-card"></i> Aadhaar No. *</label>
                <input 
                  type="text" 
                  name="aadhar"
                  value={form.aadhar}
                  onChange={handleInputChange}
                  placeholder="Enter 12-digit Aadhaar"
                  maxLength="12"
                  pattern="[0-9]{12}"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-graduation-cap"></i> Highest Qualification *</label>
                <select 
                  name="highestQualification"
                  value={form.highestQualification}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>

              {/* Row 9 - File Uploads */}
              <div className="form-group">
                <label><i className="fas fa-image"></i> Photo * (max 500KB)</label>
                <div className="file-upload-group">
                  <div className="photo-preview">
                    {documents.photo ? (
                      <>
                        <img src={URL.createObjectURL(documents.photo)} alt="Preview" />
                        <span className="upload-status">✓ Uploaded</span>
                      </>
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      name="photo"
                      onChange={handleFileChange}
                      accept="image/*"
                      id="photo"
                    />
                    <label htmlFor="photo" className="file-btn">Choose File</label>
                    <span className="file-text">{documents.photo ? documents.photo.name : 'No file chosen'}</span>
                  </div>
                </div>
                <p className="file-help">We will auto-compress up to 500KB.</p>
              </div>

              <div className="form-group">
                <label><i className="fas fa-file-pdf"></i> Marksheet/Certificate * (PDF/JPG/PNG)</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="marksheet"
                    onChange={handleFileChange}
                    accept="application/pdf,image/jpeg,image/png,image/gif,image/webp"
                    id="marksheet"
                    required
                  />
                  <label htmlFor="marksheet" className="file-btn">Choose File</label>
                  <span className="file-text">
                    {documents.marksheet ? (
                      <>
                        {documents.marksheet.name}
                        <span className="upload-status"> ✓ Uploaded</span>
                      </>
                    ) : (
                      'No file chosen'
                    )}
                  </span>
                </div>
                <p className="file-help">PDF or Image, max 2MB.</p>
              </div>

              {/* Row 10 */}
              <div className="form-group">
                <label><i className="fas fa-file-pdf"></i> ID Proof * (PDF/JPG/PNG)</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="idProof"
                    onChange={handleFileChange}
                    accept="application/pdf,image/jpeg,image/png,image/gif,image/webp"
                    id="idProof"
                    required
                  />
                  <label htmlFor="idProof" className="file-btn">Choose File</label>
                  <span className="file-text">
                    {documents.idProof ? (
                      <>
                        {documents.idProof.name}
                        <span className="upload-status"> ✓ Uploaded</span>
                      </>
                    ) : (
                      'No file chosen'
                    )}
                  </span>
                </div>
                <p className="file-help">PDF or Image, max 2MB.</p>
              </div>

              <div className="form-group">
                <label><i className="fas fa-file-pdf"></i> Caste Certificate (PDF/JPG/PNG) {['SC','ST','EWS'].includes(form.category) ? '*' : '(optional for General/OBC)'}</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="casteCertificate"
                    onChange={handleFileChange}
                    accept="application/pdf,image/jpeg,image/png,image/gif,image/webp"
                    id="casteCertificate"
                    required={['SC','ST','EWS'].includes(form.category)}
                  />
                  <label htmlFor="casteCertificate" className="file-btn">Choose File</label>
                  <span className="file-text">
                    {documents.casteCertificate ? (
                      <>
                        {documents.casteCertificate.name}
                        <span className="upload-status"> ✓ Uploaded</span>
                      </>
                    ) : (
                      'No file chosen'
                    )}
                  </span>
                </div>
                <p className="file-help">PDF or Image, max 2MB. Required for SC/ST/EWS, optional otherwise</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                <i className="fas fa-paper-plane"></i>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Registration Successful!</h2>
            <p className="success-message">{msg.text}</p>
            <p className="success-subtitle">Your registration has been submitted successfully. You will be redirected shortly.</p>
            <div className="success-modal-actions">
              <button 
                className="btn-success-modal" 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/');
                }}
              >
                <i className="fas fa-home"></i> Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
