const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidId: { type: String, required: true, unique: true },
  tenderId: { type: String, required: true },
  projectId: { type: String, required: true },
  contractorId: { type: String, required: true },
  contractorName: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  submissionDate: { type: String, required: true },
  requiredDocuments: [{ type: String }],
  eligibilityInformation: { type: String, required: true },
  status: {
    type: String,
    enum: ['Submitted', 'Under Evaluation', 'Eligible', 'Ineligible', 'Selected', 'Not Selected'],
    default: 'Submitted'
  },
  aiValidationFlags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
