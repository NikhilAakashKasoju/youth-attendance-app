const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // <-- 1. Import the 'path' module
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

// === API Routes ===
// All your API routes must be defined BEFORE the frontend serving logic
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// === Static File Serving (for Production) ===
// 2. Add this entire block
if (process.env.NODE_ENV === 'production') {
  // Get the current directory name
  const __dirname = path.resolve();
  
  // Serve the static files from the React app's 'dist' folder
  app.use(express.static(path.join(__dirname, 'backend/dist')));

  // For any route that is not an API route, send the index.html file
  // This is the key for Single Page Applications (SPAs)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'backend', 'dist', 'index.html'))
  );
} else {
  // If not in production, just have a simple root route
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}


// === Error Handling Middleware ===
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