// backend/server.js

// 1. IMPORT CORE NODE.JS & NPM MODULES
const path = require('path'); // Node.js module for working with file and directory paths
const express = require('express'); // The core web server framework
const dotenv = require('dotenv'); // Module to load environment variables from a .env file
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing

// 2. IMPORT CUSTOM MODULES
const connectDB = require('./config/db'); // Our database connection logic
const authRoutes = require('./routes/auth'); // Routes for user authentication (login/register)
const attendanceRoutes = require('./routes/attendanceRoutes'); // Routes for handling attendance

// 3. INITIALIZE CONFIGURATION & DATABASE
dotenv.config(); // Load variables from .env into process.env
connectDB(); // Establish the connection to MongoDB

// 4. INITIALIZE THE EXPRESS APPLICATION
const app = express();

// 5. SETUP GLOBAL MIDDLEWARE
app.use(cors()); // Allows your frontend to make requests to this backend
app.use(express.json()); // Enables the server to accept and parse JSON in request bodies

// 6. DEFINE API ROUTES
// All requests to /api/auth will be handled by authRoutes
app.use('/api/auth', authRoutes);
// All requests to /api/attendance will be handled by attendanceRoutes
app.use('/api/attendance', attendanceRoutes);

// 7. --- SERVE PRODUCTION FRONTEND ---
// This section is the key to your deployment strategy.
// It will only run when the application is in 'production' mode (on Render).
if (process.env.NODE_ENV === 'production') {
  // Instruct Express to serve static files (like CSS, JS, images)
  // from the 'dist' folder located in the current directory (__dirname).
  app.use(express.static(path.join(__dirname, 'dist')));

  // For any request that doesn't match an API route above,
  // send back the main index.html file from the 'dist' folder.
  // This allows React Router to take over and handle client-side routing.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  );
} else {
  // In development mode, provide a simple message for the root URL.
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// 8. SETUP CUSTOM ERROR HANDLING MIDDLEWARE
// This acts as a catch-all for any errors that occur in your routes.
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show the error stack in development for security reasons
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 9. START THE WEB SERVER
// Get the port from environment variables or default to 5000.
const PORT = process.env.PORT || 5000;
// Start listening for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});