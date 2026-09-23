const mongoose = require('mongoose');

const billPaymentSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  contractorId: { type: String, required: true },
  billNumber: { type: String, required: true },
  billAmount: { type: Number, required: true },
  submittedDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Submitted', 'Under Inspection', 'Approved', 'Paid', 'Discrepancy Flagged', 'Rejected'],
    default: 'Submitted'
  },
  approvedAmount: { type: Number, default: 0 },
  paymentReference: { type: String, default: null },
  paidDate: { type: String, default: null },
  costVariationPercent: { type: Number, default: 0 },
  revisedCost: { type: Number, default: 0 },
  revisionReason: { type: String, default: null },
  aiAnomalyFlag: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BillPayment', billPaymentSchema);
