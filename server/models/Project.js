const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // Road, Community Hall, School, Water Supply, Street Lighting, Health Facility, etc.
  stateId: { type: String, required: true },
  districtId: { type: String, required: true },
  constituencyId: { type: String, required: true },
  localityId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  terrainType: { type: String, enum: ['Plain', 'Hilly', 'Mountain', 'Remote'], default: 'Plain' },
  roadLengthKm: { type: Number, default: 0 },
  roadWidthMeters: { type: Number, default: 0 },
  estimatedCost: { type: Number, required: true },
  sanctionedAmount: { type: Number, required: true },
  contractAmount: { type: Number, default: 0 },
  expenditure: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // 0 to 100
  startDate: { type: String, required: true },
  expectedCompletionDate: { type: String, required: true },
  actualCompletionDate: { type: String, default: null },
  implementingAgency: { type: String, required: true },
  contractorId: { type: String, default: null },
  contractorName: { type: String, default: null },
  description: { type: String, required: true },
  photos: [{ type: String }],
  status: {
    type: String,
    enum: ['Sanctioned', 'Tender Published', 'Bidding Closed', 'Awarded', 'Work Started', 'Ongoing', 'Delayed', 'Completed', 'Cancelled'],
    default: 'Sanctioned'
  },
  riskScore: { type: Number, default: 0 }, // 0 to 100
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  riskReasons: [{ type: String }],
  scenarioId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
