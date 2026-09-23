const express = require('express');
const router = express.Router();
const { authenticateToken, getGeographicFilter } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// GET /api/search?q=query - Global search with role & geographic access control
router.get('/', authenticateToken, (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) {
    return res.json({ success: true, projects: [], tenders: [], contractors: [], alerts: [] });
  }

  const geoFilter = getGeographicFilter(req.user);

  // Filter projects matching search term and user geographic scope
  let projects = memoryDB.projects.filter(p => {
    const matchesGeo =
      (!geoFilter.stateId || p.stateId === geoFilter.stateId) &&
      (!geoFilter.districtId || p.districtId === geoFilter.districtId) &&
      (!geoFilter.constituencyId || p.constituencyId === geoFilter.constituencyId) &&
      (!geoFilter.contractorId || p.contractorId === geoFilter.contractorId);

    const matchesQuery =
      p.projectId.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.contractorName.toLowerCase().includes(query) ||
      p.village.toLowerCase().includes(query) ||
      p.districtId.toLowerCase().includes(query);

    return matchesGeo && matchesQuery;
  });

  // Filter tenders matching query
  let tenders = memoryDB.tenders.filter(t =>
    t.tenderId.toLowerCase().includes(query) ||
    t.tenderTitle.toLowerCase().includes(query) ||
    t.projectName.toLowerCase().includes(query)
  );

  // Filter contractors matching query
  let contractors = memoryDB.contractors.filter(c =>
    c.contractorId.toLowerCase().includes(query) ||
    c.companyName.toLowerCase().includes(query)
  );

  res.json({
    success: true,
    query,
    results: {
      projects: projects.map(p => ({
        id: p.projectId,
        name: p.name,
        district: p.districtId,
        sanctionedAmount: p.sanctionedAmount,
        status: p.status,
        riskLevel: p.riskLevel
      })),
      tenders: tenders.map(t => ({
        id: t.tenderId,
        title: t.tenderTitle,
        estimatedCost: t.estimatedCost,
        status: t.status
      })),
      contractors: contractors.map(c => ({
        id: c.contractorId,
        name: c.companyName,
        totalContracts: c.totalContracts
      }))
    }
  });
});

module.exports = router;
