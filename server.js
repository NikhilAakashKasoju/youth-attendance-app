// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- Updated
const cors = require('cors');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

// Use the new user routes
app.use('/api/users', userRoutes); // <-- Updated
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Master Data Registration API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));