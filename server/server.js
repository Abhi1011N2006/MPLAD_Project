const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static upload serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tenders', require('./routes/tenderRoutes'));
app.use('/api/contracts', require('./routes/contractRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/weekly-reports', require('./routes/reportRoutes'));
app.use('/api/contractors', require('./routes/contractorRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MPLADS Express Backend REST API',
    timestamp: new Date().toISOString()
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 MPLADS Express Server running on http://localhost:${PORT}`);
  console.log(`===================================================`);
});
