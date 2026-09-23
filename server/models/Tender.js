const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  tenderId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  projectName: { type: String, required: true },
  tenderTitle: { type: String, required: true },
  description: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  publicationDate: { type: String, required: true },
  submissionDeadline: { type: String, required: true },
  eligibilityRequirements: { type: String, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Bidding Open', 'Bidding Closed', 'Under Evaluation', 'Awarded', 'Cancelled'],
    default: 'Published'
  },
  awardedContractorId: { type: String, default: null },
  awardedAmount: { type: Number, default: 0 },
  awardedDate: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tender', tenderSchema);
