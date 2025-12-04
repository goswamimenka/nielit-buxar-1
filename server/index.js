require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const Registration = require('./models/Registration');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ensure uploads dir exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// serve uploaded files so admin can download/view them
app.use('/uploads', express.static(uploadDir));

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  }
});

const upload = multer({ storage });

// connect to MongoDB
async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('Please set MONGO_URI in environment');
      process.exit(1);
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // ensure admin user exists (use env ADMIN_EMAIL / ADMIN_PASSWORD or defaults)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nielitbuxer';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin123@';
    const jwtSecret = process.env.JWT_SECRET || 'replace_this_with_strong_secret';

    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(adminPass, salt);
      await Admin.create({ email: adminEmail, password: hashed });
      console.log('Default admin created:', adminEmail);
    } else {
      console.log('Admin user exists:', adminEmail);
    }

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
}

// Admin login
app.post('/api/admin/login', express.json(), async (req, res) => {
  try {
    // accept multiple possible field names from frontend
    let identifier = (req.body.email || req.body.emailOrPhone || '').trim();
    const password = (req.body.password || '').trim();
    if (!identifier || !password) return res.status(400).json({ message: 'Email and password required' });

    // allow simple alias 'admin' to mean the configured admin email
    const configuredAdmin = (process.env.ADMIN_EMAIL || 'admin@nielitbuxer').trim();
    if (identifier.toLowerCase() === 'admin') identifier = configuredAdmin;

    // case-insensitive lookup
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('^' + escapeRegex(identifier) + '$', 'i');
    const admin = await Admin.findOne({ email: re });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'replace_this_with_strong_secret', { expiresIn: '6h' });
    return res.json({ token, email: admin.email });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// registration endpoint
app.post('/api/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'casteCertificate', maxCount: 1 }
]), async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};

    // basic validation
    if (!body.name || !body.email || !body.mobile || !body.dateOfBirth) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!files.marksheet || !files.idProof) {
      return res.status(400).json({ message: 'Marksheet and ID proof are required' });
    }

    const needsCaste = ['SC','ST','EWS'].includes(String(body.category || '').toUpperCase());
    if (needsCaste && !files.casteCertificate) {
      return res.status(400).json({ message: 'Caste certificate required for selected category' });
    }

    // validate file types & sizes
    const checkFile = (f, rules) => {
      if (!f) return false;
      if (rules.types && !rules.types.includes(f.mimetype)) return false;
      if (rules.maxSize && f.size > rules.maxSize) return false;
      return true;
    };

    // photo: image, max 500KB
    if (files.photo && !checkFile(files.photo[0], { types: ['image/jpeg','image/png','image/webp','image/gif'], maxSize: 500*1024 })) {
      return res.status(400).json({ message: 'Photo must be image and <= 500KB' });
    }
    // pdf or image files max 2MB
    const docRules = { types: ['application/pdf', 'image/jpeg','image/png','image/webp','image/gif'], maxSize: 2*1024*1024 };
    if (!checkFile(files.marksheet && files.marksheet[0], docRules) || !checkFile(files.idProof && files.idProof[0], docRules)) {
      return res.status(400).json({ message: 'Marksheet/ID proof must be PDF or image and <= 2MB' });
    }
    if (files.casteCertificate && !checkFile(files.casteCertificate[0], docRules)) {
      return res.status(400).json({ message: 'Caste certificate must be PDF or image and <= 2MB' });
    }

    // create registration document
    const doc = new Registration({
      name: body.name,
      mobile: body.mobile,
      whatsapp: body.whatsapp,
      email: body.email,
      aadhar: body.aadhar,
      highestQualification: body.highestQualification,
      pincode: body.pincode,
      state: body.state,
      district: body.district,
      postOffice: body.postOffice,
      address: body.address,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      category: body.category,
      files: {
        photo: files.photo ? path.relative(__dirname, files.photo[0].path) : undefined,
        marksheet: files.marksheet ? path.relative(__dirname, files.marksheet[0].path) : undefined,
        idProof: files.idProof ? path.relative(__dirname, files.idProof[0].path) : undefined,
        casteCertificate: files.casteCertificate ? path.relative(__dirname, files.casteCertificate[0].path) : undefined,
      }
    });

    await doc.save();

    return res.json({ message: 'Registration received. We will contact you shortly.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

start();

// simple middleware to verify admin JWT
function verifyAdminToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Unauthorized' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace_this_with_strong_secret');
    // optional: attach payload
    req.admin = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Admin: list registrations (protected)
app.get('/api/admin/registrations', verifyAdminToken, async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 }).lean();
    return res.json({ registrations: regs });
  } catch (err) {
    console.error('Fetch registrations error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update registration status (protected)
app.put('/api/admin/registrations/:id', verifyAdminToken, express.json(), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected'];
    
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    ).lean();

    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    
    return res.json({ registration, message: 'Status updated successfully' });
  } catch (err) {
    console.error('Update registration status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get profile (protected)
app.get('/api/admin/profile', verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password').lean();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const profile = {
      username: admin.username || admin.email,
      name: admin.name || '',
      designation: admin.designation || '',
      mobile: admin.mobile || '',
      email: admin.email
    };
    
    return res.json({ profile });
  } catch (err) {
    console.error('Fetch profile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update profile (protected)
app.put('/api/admin/profile', verifyAdminToken, express.json(), async (req, res) => {
  try {
    const { username, name, designation, mobile } = req.body;
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      {
        username: username || '',
        name: name || '',
        designation: designation || '',
        mobile: mobile || '',
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password').lean();
    
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const profile = {
      username: admin.username || admin.email,
      name: admin.name || '',
      designation: admin.designation || '',
      mobile: admin.mobile || '',
      email: admin.email
    };
    
    return res.json({ profile, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});
