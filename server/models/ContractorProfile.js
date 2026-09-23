const mongoose = require('mongoose');

const contractorProfileSchema = new mongoose.Schema({
  contractorId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  companyType: { type: String, required: true }, // Pvt Ltd, LLP, Partnership, Proprietary
  registeredAddress: { type: String, required: true },
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    representative: { type: String, required: true }
  },
  eligibilityStatus: { type: String, default: 'Class A Registered Contractor' },
  totalContracts: { type: Number, default: 0 },
  successfullyCompleted: { type: Number, default: 0 },
  currentlyWorking: { type: Number, default: 0 },
  delayed: { type: Number, default: 0 },
  cancelledOrTerminated: { type: Number, default: 0 },
  contractsHistory: [
    {
      projectId: { type: String },
      projectName: { type: String },
      year: { type: String },
      contractAmount: { type: Number },
      startDate: { type: String },
      expectedCompletion: { type: String },
      actualCompletion: { type: String, default: null },
      status: { type: String }, // Completed, In Progress, Delayed, Cancelled, Terminated
      delayDays: { type: Number, default: 0 },
      costVariationPercent: { type: Number, default: 0 },
      finalAmount: { type: Number }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContractorProfile', contractorProfileSchema);
