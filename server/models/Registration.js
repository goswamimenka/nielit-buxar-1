const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  whatsapp: String,
  email: { type: String, required: true },
  aadhar: String,
  highestQualification: String,
  pincode: String,
  state: String,
  district: String,
  postOffice: String,
  address: String,
  dateOfBirth: String,
  gender: String,
  category: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  files: {
    photo: String,
    marksheet: String,
    idProof: String,
    casteCertificate: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', Schema);
