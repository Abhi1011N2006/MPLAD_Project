const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// GET /api/reports/weekly - List weekly contractor reports
router.get(['/weekly', '/'], authenticateToken, (req, res) => {
  res.json({ success: true, count: memoryDB.weeklyReports.length, data: memoryDB.weeklyReports });
});

// POST /api/reports/weekly & POST /api/weekly-reports - Contractor submits weekly progress report
router.post(['/weekly', '/'], authenticateToken, (req, res) => {
  const role = req.user ? req.user.role : 'CITIZEN';
  if (role === 'CITIZEN' || role === 'PUBLIC') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: '403 Forbidden: Public/Citizen users are not authorized to submit contractor weekly progress reports.'
    });
  }

  // Contractor Ownership Security Guard
  if (role === 'CONTRACTOR') {
    const authContractorId = req.user.contractorId || 'CONT-101';
    const targetProjectId = req.body.projectId;
    const project = memoryDB.projects.find(p => p.projectId === targetProjectId || p.project_id === targetProjectId);

    if (project) {
      const projContractorId = project.contractorId || project.contractor_id || project.contractor_agency || '';
      // Check if project belongs to another contractor
      if (projContractorId && projContractorId !== authContractorId && !projContractorId.toLowerCase().includes(authContractorId.toLowerCase())) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: `403 Forbidden: Contractor ${authContractorId} is not authorized to submit weekly progress reports for a project assigned to another contractor.`
        });
      }
    }
  }

  const newReport = {
    reportId: `WR-2026-${Math.floor(100 + Math.random() * 900)}`,
    contractorId: req.user.contractorId || 'CONT-101',
    reportDate: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    ...req.body,
    createdAt: new Date()
  };

  memoryDB.weeklyReports.unshift(newReport);

  // Update physical progress on project
  const project = memoryDB.projects.find(p => p.projectId === req.body.projectId || p.project_id === req.body.projectId);
  if (project) {
    project.progress = Number(req.body.progressPercentage || req.body.progress || project.progress);
    if (project.expenditure / project.sanctionedAmount > 0.8 && project.progress < 50) {
      project.riskScore = 82;
      project.riskLevel = 'HIGH';
      project.riskReasons.push(`Week ${req.body.weekNumber}: High expenditure relative to physical progress (${project.progress}%)`);
    }
  }

  res.status(201).json({ success: true, data: newReport });
});

// GET /api/reports/citizen - List citizen reports
router.get('/citizen', authenticateToken, (req, res) => {
  res.json({ success: true, count: memoryDB.citizenReports.length, data: memoryDB.citizenReports });
});

// POST /api/reports/citizen - Submit citizen complaint report
router.post('/citizen', authenticateToken, (req, res) => {
  const newReport = {
    reportId: `CR-2026-${Math.floor(100 + Math.random() * 900)}`,
    submittedBy: req.body.submittedBy || 'Anonymous Citizen',
    timestamp: new Date().toISOString(),
    verificationStatus: 'Unverified',
    confidenceScore: 0.50,
    ...req.body,
    createdAt: new Date()
  };

  memoryDB.citizenReports.unshift(newReport);
  res.status(201).json({ success: true, data: newReport });
});

// PATCH /api/reports/citizen/:id/status - Update citizen report verification status
router.patch('/citizen/:id/status', authenticateToken, (req, res) => {
  const report = memoryDB.citizenReports.find(r => r.reportId === req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

  report.verificationStatus = req.body.status;
  res.json({ success: true, data: report });
});

module.exports = router;
