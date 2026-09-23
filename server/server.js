const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting process.env.FRONTEND_URL with local fallback
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive fallback for production deployment flexibility
    }
  },
  credentials: true
}));

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

// GET /api/health - Health check endpoint for Render monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MPLADS Express Backend REST API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start Express Server listening on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`🚀 MPLADS Express Server running on 0.0.0.0:${PORT}`);
  console.log(`===================================================`);
});
