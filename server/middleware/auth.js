const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mplads_secret_key_demo_2026';

// Token Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Demo fallback for testing without explicit token header
    req.user = {
      id: 'demo-user-id',
      name: 'Demo Admin',
      role: req.headers['x-demo-role'] || 'MINISTRY',
      assignedStateId: req.headers['x-assigned-state'] || 'MH',
      assignedDistrictId: req.headers['x-assigned-district'] || 'Nashik',
      assignedConstituencyId: req.headers['x-assigned-constituency'] || 'Nashik-LS',
      contractorId: req.headers['x-contractor-id'] || 'CONT-101'
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// Geographic & Role-Based Authorization Helper
function getGeographicFilter(user) {
  if (!user) return {};

  switch (user.role) {
    case 'MINISTRY':
      return {}; // All national projects
    case 'STATE':
      return { stateId: user.assignedStateId || 'MH' };
    case 'DISTRICT':
      return { districtId: user.assignedDistrictId || 'Nashik' };
    case 'MP':
      return { constituencyId: user.assignedConstituencyId || 'Nashik-LS' };
    case 'CONTRACTOR':
      return { contractorId: user.contractorId || 'CONT-101' };
    case 'CITIZEN':
      // Citizen scope by state/district or locality
      const filter = {};
      if (user.assignedStateId) filter.stateId = user.assignedStateId;
      if (user.assignedDistrictId) filter.districtId = user.assignedDistrictId;
      return filter;
    default:
      return {};
  }
}

// Role Requirement Guard
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}` });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  getGeographicFilter,
  requireRole,
  JWT_SECRET
};
