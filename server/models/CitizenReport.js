const mongoose = require('mongoose');

const citizenReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  projectName: { type: String, required: true },
  reportType: {
    type: String,
    enum: ['Work not started', 'Work stopped', 'Work progressing slowly', 'Poor quality', 'Progress mismatch', 'Possible duplicate work', 'Damaged work', 'Incorrect location', 'Other'],
    required: true
  },
  description: { type: String, required: true },
  submittedBy: { type: String, default: 'Anonymous Citizen' },
  photoUrl: { type: String, default: null },
  videoUrl: { type: String, default: null },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  gpsAccuracyMeters: { type: Number, default: 10 },
  isManualLocation: { type: Boolean, default: false },
  timestamp: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ['Unverified', 'Under Review', 'Corroborated', 'Rejected'],
    default: 'Unverified'
  },
  confidenceScore: { type: Number, default: 0.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CitizenReport', citizenReportSchema);
