// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes'); // New admin routes
const userRegistrationRoutes = require('./routes/userRegistrationRoutes'); // New public registration routes
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Public route for user registration
app.use('/api/register', userRegistrationRoutes);

// Admin routes (login, get all users)
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Master Data Registration API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});