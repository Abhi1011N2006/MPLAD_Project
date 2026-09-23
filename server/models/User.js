const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['MINISTRY', 'STATE', 'DISTRICT', 'MP', 'CONTRACTOR', 'CITIZEN'],
    required: true
  },
  assignedStateId: { type: String, default: null }, // e.g., 'MH'
  assignedDistrictId: { type: String, default: null }, // e.g., 'Nashik'
  assignedConstituencyId: { type: String, default: null }, // e.g., 'Nashik-LS'
  assignedLocalityId: { type: String, default: null }, // e.g., 'Dindori'
  contractorId: { type: String, default: null }, // e.g., 'CONT-101'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
