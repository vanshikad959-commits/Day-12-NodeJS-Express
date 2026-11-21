require('dotenv').config();

const express = require('express');
const cors = require('cors');

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Global middleware ----------
app.use(cors()); // enable CORS for all origins
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(logger); // custom request logger

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Employee Management REST API - ApexLark Full Stack Development Internship (Day 12)',
    endpoints: {
      getAll: 'GET /employees',
      getById: 'GET /employees/:id',
      create: 'POST /employees',
      update: 'PUT /employees/:id',
      delete: 'DELETE /employees/:id',
    },
  });
});

app.use('/employees', employeeRoutes);

// ---------- Fallback 404 + error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

// Start the server only when run directly (keeps app importable for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
