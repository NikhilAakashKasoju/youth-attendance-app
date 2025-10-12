// backend/routes/auth.js
const express = require('express');
const asyncHandler = require('express-async-handler'); // A simple wrapper for async middleware
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      userId,
      phoneNumber,
      whatsappNumber,
      address,
      center,
      district,
      mandal,
      village,
      dob,
      age,
      occupation,
      occupationDetails,
      isPreceptor,
      gender,
      password, // Password for initial registration
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ phoneNumber }); // Using phone number as a unique identifier for now
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this phone number');
    }

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      userId,
      phoneNumber,
      whatsappNumber,
      address,
      center,
      district,
      mandal,
      village,
      dob,
      age,
      occupation,
      occupationDetails,
      isPreceptor,
      gender,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id), // Send a JWT token upon successful registration
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ phoneNumber });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid phone number or password');
    }
  })
);

module.exports = router;