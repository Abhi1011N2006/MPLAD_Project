const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// GET /api/contractors - List contractors
router.get('/', authenticateToken, (req, res) => {
  res.json({ success: true, count: memoryDB.contractors.length, data: memoryDB.contractors });
});

// GET /api/contractors/:id - Get detailed performance history profile
router.get('/:id', authenticateToken, (req, res) => {
  const contractor = memoryDB.contractors.find(c => c.contractorId === req.params.id) || memoryDB.contractors[0];
  res.json({ success: true, data: contractor });
});

module.exports = router;
