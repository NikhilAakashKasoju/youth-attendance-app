// backend/server.js

const path = require('path'); // Import the 'path' module
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- API Routes ---
// These must come BEFORE the frontend serving logic
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// --- DEPLOYMENT LOGIC ---
// This code will only run in production
if (process.env.NODE_ENV === 'production') {
  // Set the static build folder for the frontend
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // For any route that is not an API route, send the index.html file
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
  );
} else {
  // If not in production, just have a simple root route
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});