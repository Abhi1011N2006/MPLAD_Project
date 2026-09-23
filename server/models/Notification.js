const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  recipientRole: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'New Tender Published',
      'Bid Deadline Approaching',
      'Weekly Report Missing',
      'AI Risk Alert',
      'Citizen Report Submitted',
      'Inspection Scheduled',
      'Payment Under Review',
      'Contract Awarded',
      'Project Delayed'
    ],
    required: true
  },
  projectId: { type: String, default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
