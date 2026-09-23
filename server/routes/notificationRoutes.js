const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const mockNotifications = [
  {
    id: "NOTIF-2026-001",
    type: "AI Risk Alert",
    title: "High-Risk Anomaly Flagged",
    message: "Project MPLAD-2026-MH-005A flagged for 92% duplicate probability with Site B.",
    time: "10 mins ago",
    unread: true
  },
  {
    id: "NOTIF-2026-002",
    type: "New Tender Published",
    title: "Tender Published in Nashik",
    message: "District Authority Nashik published Tender TND-2026-MH-101 for RCC Anganwadi Building.",
    time: "1 hour ago",
    unread: true
  },
  {
    id: "NOTIF-2026-003",
    type: "Citizen Report Submitted",
    title: "Field Observation Received",
    message: "Citizen submitted photo evidence for project MPLAD-2026-MH-003 (Sinnar).",
    time: "3 hours ago",
    unread: false
  },
  {
    id: "NOTIF-2026-004",
    type: "Weekly Report Missing",
    title: "Overdue Contractor Report",
    message: "Solar Borewell project MPLAD-2026-MH-004 has 3 missing weekly reports.",
    time: "1 day ago",
    unread: false
  }
];

// GET /api/notifications - List active notifications for user
router.get('/', authenticateToken, (req, res) => {
  res.json({ success: true, count: mockNotifications.length, data: mockNotifications });
});

module.exports = router;
