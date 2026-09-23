const mongoose = require('mongoose');

const weeklyReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  contractorId: { type: String, required: true },
  weekNumber: { type: Number, required: true },
  reportDate: { type: String, required: true },
  progressPercentage: { type: Number, required: true },
  workCompletedThisWeek: { type: String, required: true },
  amountSpentThisWeek: { type: Number, required: true },
  materialsUsed: { type: String, required: true },
  numberOfWorkers: { type: Number, required: true },
  problemsOrDelays: { type: String, default: 'None' },
  expectedNextWeekWork: { type: String, default: '' },
  photoUrl: { type: String, default: null },
  videoUrl: { type: String, default: null },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  gpsAccuracyMeters: { type: Number, default: 5 },
  isManualLocation: { type: Boolean, default: false },
  timestamp: { type: String, required: true },
  aiValidationFlag: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeeklyReport', weeklyReportSchema);
