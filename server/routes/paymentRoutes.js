const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// GET /api/payments - List bill payments
router.get('/', authenticateToken, (req, res) => {
  res.json({ success: true, count: memoryDB.billPayments.length, data: memoryDB.billPayments });
});

// POST /api/payments - Submit bill for payment
router.post('/', authenticateToken, (req, res) => {
  const newBill = {
    billId: `BILL-2026-${Math.floor(100 + Math.random() * 900)}`,
    submittedDate: new Date().toISOString().split('T')[0],
    status: 'Submitted',
    ...req.body,
    createdAt: new Date()
  };

  memoryDB.billPayments.unshift(newBill);
  res.status(201).json({ success: true, data: newBill });
});

module.exports = router;
