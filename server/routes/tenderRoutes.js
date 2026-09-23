const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// GET /api/tenders - List tenders
router.get('/', authenticateToken, (req, res) => {
  res.json({ success: true, count: memoryDB.tenders.length, data: memoryDB.tenders });
});

// POST /api/tenders - Create Tender (District Authority / Admin)
router.post('/', authenticateToken, requireRole(['DISTRICT', 'MINISTRY']), (req, res) => {
  const newTender = {
    tenderId: `TND-2026-MH-${Math.floor(100 + Math.random() * 900)}`,
    ...req.body,
    publicationDate: new Date().toISOString().split('T')[0],
    status: 'Published',
    awardedContractorId: null,
    awardedAmount: 0,
    createdAt: new Date()
  };

  memoryDB.tenders.unshift(newTender);
  res.status(201).json({ success: true, data: newTender });
});

// GET /api/tenders/:id/bids - Get bids for a tender
router.get('/:id/bids', authenticateToken, (req, res) => {
  const tenderBids = memoryDB.bids.filter(b => b.tenderId === req.params.id);
  res.json({ success: true, data: tenderBids });
});

// POST /api/tenders/:id/bids - Contractor submits a bid
router.post('/:id/bids', authenticateToken, requireRole(['CONTRACTOR']), (req, res) => {
  const newBid = {
    bidId: `BID-2026-${Math.floor(100 + Math.random() * 900)}`,
    tenderId: req.params.id,
    contractorId: req.user.contractorId || 'CONT-101',
    contractorName: req.body.contractorName || 'Apex Infra Tech Ltd',
    bidAmount: req.body.bidAmount,
    submissionDate: new Date().toISOString().split('T')[0],
    eligibilityInformation: req.body.eligibilityInformation || 'Class A Registered Contractor',
    status: 'Submitted',
    aiValidationFlags: ['Document format valid', 'Bid amount within 10% benchmark variance'],
    createdAt: new Date()
  };

  memoryDB.bids.unshift(newBid);
  res.status(201).json({ success: true, data: newBid });
});

// POST /api/tenders/:id/award - District Authority awards tender to a contractor
router.post('/:id/award', authenticateToken, requireRole(['DISTRICT', 'MINISTRY']), (req, res) => {
  const { contractorId, awardedAmount } = req.body;
  const tender = memoryDB.tenders.find(t => t.tenderId === req.params.id);

  if (!tender) return res.status(404).json({ success: false, message: 'Tender not found.' });

  tender.status = 'Awarded';
  tender.awardedContractorId = contractorId;
  tender.awardedAmount = awardedAmount;

  // Update associated project status & contractor
  const project = memoryDB.projects.find(p => p.projectId === tender.projectId);
  if (project) {
    project.status = 'Awarded';
    project.contractorId = contractorId;
    project.contractAmount = awardedAmount;
  }

  res.json({ success: true, message: 'Tender awarded successfully!', data: tender });
});

module.exports = router;
