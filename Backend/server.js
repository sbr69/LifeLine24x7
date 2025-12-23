const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { errorHandler, notFound, requestLogger } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/modules/auth');
const { admissionsRoutes } = require('./src/modules/AdmittedPatients');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LifeLine24x7 API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log(`║  🏥 LifeLine24x7 Backend Server       ║`);
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Port: ${PORT}                            ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}              ║`);
  console.log(`║  Database: ${process.env.DB_NAME}              ║`);
  console.log('╚════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
