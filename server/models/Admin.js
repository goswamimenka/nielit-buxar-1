const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  username: { type: String, default: '' },
  name: { type: String, default: '' },
  designation: { type: String, default: '' },
  mobile: { type: String, default: '' },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
