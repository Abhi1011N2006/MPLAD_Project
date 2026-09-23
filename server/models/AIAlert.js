const mongoose = require('mongoose');

const aiAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  projectName: { type: String, required: true },
  type: {
    type: String,
    enum: ['Cost anomaly', 'Payment anomaly', 'Project delay', 'Progress discrepancy', 'Possible duplicate', 'GPS inconsistency', 'Photo inconsistency', 'Missing weekly report'],
    required: true
  },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  riskScore: { type: Number, required: true },
  reason: { type: String, required: true },
  date: { type: String, required: true },
  evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: {
    type: String,
    enum: ['New', 'Under Review', 'Verified', 'False Positive', 'Resolved'],
    default: 'New'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIAlert', aiAlertSchema);
