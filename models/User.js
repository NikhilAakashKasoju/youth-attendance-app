// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
    },
    userId: { // Changed from 'id' to 'userId' to avoid confusion with MongoDB's _id
      type: String,
      required: [true, 'ID is required'],
      minlength: 3, // Minimal length for N/A or actual ID
      maxlength: 9, // Max length for actual ID
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      match: [/^\d{10}$/, 'Please fill a valid 10 digit phone number'], // Basic 10-digit validation
    },
    whatsappNumber: {
      type: String,
      required: [true, 'Whatsapp Number is required'],
      match: [/^\d{10}$/, 'Please fill a valid 10 digit whatsapp number'], // Basic 10-digit validation
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    center: {
      type: String,
      required: [true, 'Center is required'],
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    mandal: {
      type: String,
      required: [true, 'Mandal is required'],
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
    },
    dob: {
      type: Date,
      required: [true, 'Date of Birth is required'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
      max: [36, 'Age cannot exceed 36 years'], // Age limit validation
    },
    occupation: {
      type: String,
      enum: ['Student', 'Working Professional', 'Other'], // Define allowed values
      required: [true, 'Occupation is required'],
    },
    occupationDetails: { // To store details like B-Tech, Inter, PG for students or specifics for working professionals
      type: String,
    },
    isPreceptor: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'], // Define allowed values
      required: [true, 'Gender is required'],
    },
    password: { // We'll need a password for initial registration and subsequent login
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;