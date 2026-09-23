const mongoose = require('mongoose');

const projectEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  eventType: {
    type: String,
    enum: [
      'MP Recommendation',
      'District Processing',
      'Tender Published',
      'Bidding Closed',
      'Contract Awarded',
      'Work Started',
      'Weekly Report Submitted',
      'Citizen Report Submitted',
      'AI Progress Alert',
      'Inspection Scheduled',
      'Bill Payment Processed',
      'Project Completed'
    ],
    required: true
  },
  userId: { type: String, default: 'System' },
  userRole: { type: String, default: 'SYSTEM' },
  timestamp: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProjectEvent', projectEventSchema);
