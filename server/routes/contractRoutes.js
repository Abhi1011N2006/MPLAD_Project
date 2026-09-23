const express = require('express');
const router = express.Router();
const { authenticateToken, getGeographicFilter } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// Initial contracts list
const initialContracts = [
  {
    contractId: "CNT-2025-MH-001",
    projectId: "MPLAD-2026-MH-001",
    projectName: "Multipurpose Community Hall at Dindori",
    contractorId: "CONT-101",
    contractorName: "Apex Infra Tech Ltd",
    tenderId: "TND-2025-MH-088",
    contractAmount: 1850000,
    startDate: "2025-11-01",
    expectedCompletionDate: "2026-05-30",
    actualCompletionDate: null,
    status: "Active",
    paidExpenditure: 1800000,
    progressPercentage: 40,
    costVariationPercent: 0
  },
  {
    contractId: "CNT-2025-MH-002",
    projectId: "MPLAD-2026-MH-002",
    projectName: "Mountain Road Construction (Trimbak)",
    contractorId: "CONT-102",
    contractorName: "Sahyadri Earthmovers & Infra",
    tenderId: "TND-2025-MH-042",
    contractAmount: 3300000,
    startDate: "2025-08-15",
    expectedCompletionDate: "2026-08-15",
    actualCompletionDate: null,
    status: "Active",
    paidExpenditure: 3200000,
    progressPercentage: 85,
    costVariationPercent: 0
  },
  {
    contractId: "CNT-2025-MH-006",
    projectId: "MPLAD-2026-MH-006",
    projectName: "Gram Panchayat Concrete Road & Drainage",
    contractorId: "CONT-106",
    contractorName: "Kadam Infra Projects",
    tenderId: "TND-2025-MH-019",
    contractAmount: 1750000,
    startDate: "2025-06-01",
    expectedCompletionDate: "2025-12-31",
    actualCompletionDate: "2025-12-28",
    status: "Completed",
    paidExpenditure: 1750000,
    progressPercentage: 100,
    costVariationPercent: 0
  }
];

if (!memoryDB.contracts || memoryDB.contracts.length === 0) {
  memoryDB.contracts = [...initialContracts];
}

// GET /api/contracts - List contracts filtered by user role & contractor ID
router.get('/', authenticateToken, (req, res) => {
  let contracts = memoryDB.contracts;

  // Contractor scope: return ONLY contracts assigned to that contractor
  if (req.user && req.user.role === 'CONTRACTOR') {
    const contractorId = req.user.contractorId || 'CONT-101';
    contracts = contracts.filter(c => c.contractorId === contractorId);
  }

  res.json({
    success: true,
    userRole: req.user ? req.user.role : 'GUEST',
    count: contracts.length,
    data: contracts
  });
});

// GET /api/contracts/:id - Get single contract details
router.get('/:id', authenticateToken, (req, res) => {
  const contract = memoryDB.contracts.find(c => c.contractId === req.params.id || c.projectId === req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found.' });
  }

  // Security check for contractor role
  if (req.user && req.user.role === 'CONTRACTOR') {
    const contractorId = req.user.contractorId || 'CONT-101';
    if (contract.contractorId !== contractorId) {
      return res.status(403).json({ success: false, message: 'Access denied to unauthorized contract.' });
    }
  }

  res.json({ success: true, data: contract });
});

module.exports = router;
