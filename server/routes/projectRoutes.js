const express = require('express');
const router = express.Router();
const { authenticateToken, getGeographicFilter } = require('../middleware/auth');
const { memoryDB } = require('../seedData');

// GET /api/projects - List projects filtered by Geographic Access Control
router.get('/', authenticateToken, (req, res) => {
  const geoFilter = getGeographicFilter(req.user);
  let projects = memoryDB.projects;

  if (geoFilter.stateId) {
    projects = projects.filter(p => p.stateId === geoFilter.stateId);
  }
  if (geoFilter.districtId) {
    projects = projects.filter(p => p.districtId === geoFilter.districtId);
  }
  if (geoFilter.constituencyId) {
    projects = projects.filter(p => p.constituencyId === geoFilter.constituencyId);
  }
  if (geoFilter.contractorId) {
    projects = projects.filter(p => p.contractorId === geoFilter.contractorId);
  }

  res.json({
    success: true,
    userRole: req.user ? req.user.role : 'GUEST',
    count: projects.length,
    data: projects
  });
});

// GET /api/projects/:id - Get single project details with strict RBAC scope enforcement
router.get('/:id', authenticateToken, (req, res) => {
  const project = memoryDB.projects.find(p => p.projectId === req.params.id || p.project_id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }

  const role = req.user ? req.user.role : 'CITIZEN';
  if (role === 'CONTRACTOR') {
    const userContractorId = req.user.contractorId || 'CONT-101';
    const projContractorId = project.contractorId || project.contractor_id || project.contractor_agency || '';
    if (projContractorId && projContractorId !== userContractorId && !projContractorId.toLowerCase().includes(userContractorId.toLowerCase())) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: '403 Forbidden: Contractor A is not authorized to access projects assigned to Contractor B.'
      });
    }
  } else if (role === 'STATE') {
    const userState = req.user.assignedStateId || 'MH';
    const projState = project.stateId || project.state;
    if (projState && projState !== userState && projState.toLowerCase() !== userState.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: '403 Forbidden: State user is not authorized to access projects from another state.'
      });
    }
  } else if (role === 'DISTRICT') {
    const userDist = req.user.assignedDistrictId || 'Nashik';
    const projDist = project.districtId || project.district;
    if (projDist && projDist !== userDist && projDist.toLowerCase() !== userDist.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: '403 Forbidden: District user is not authorized to access projects from another district.'
      });
    }
  } else if (role === 'MP') {
    const userConst = req.user.assignedConstituencyId || 'Nashik-LS';
    const projConst = project.constituencyId || project.constituency;
    if (projConst && projConst !== userConst && projConst.toLowerCase() !== userConst.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: '403 Forbidden: MP is not authorized to access projects outside assigned constituency.'
      });
    }
  }

  res.json({ success: true, data: project });
});

// POST /api/projects - Sanction new project
router.post('/', authenticateToken, (req, res) => {
  const newProject = {
    projectId: `MPLAD-2026-MH-${Math.floor(100 + Math.random() * 900)}`,
    ...req.body,
    expenditure: 0,
    progress: 0,
    status: 'Sanctioned',
    riskScore: 10,
    riskLevel: 'LOW',
    riskReasons: ['Newly Sanctioned Project'],
    createdAt: new Date()
  };

  memoryDB.projects.unshift(newProject);
  res.status(201).json({ success: true, data: newProject });
});

module.exports = router;
