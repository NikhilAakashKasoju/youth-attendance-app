// backend/models/User.js
const mongoose = require('mongoose');

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
    userId: {
      type: String,
      required: [true, 'ID is required'],
      minlength: 3, // Minimal length for N/A or actual ID
      maxlength: 9, // Max length for actual ID
      unique: true, // Ensuring userId is unique
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      match: [/^\d{10}$/, 'Please fill a valid 10 digit phone number'],
      unique: true, // Ensuring phone number is unique
    },
    whatsappNumber: {
      type: String,
      required: [true, 'Whatsapp Number is required'],
      match: [/^\d{10}$/, 'Please fill a valid 10 digit whatsapp number'],
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
      max: [36, 'Age cannot exceed 36 years'],
    },
    occupation: {
      type: String,
      enum: ['Student', 'Working Professional', 'Other'],
      required: [true, 'Occupation is required'],
    },
    occupationDetails: {
      type: String,
    },
    isPreceptor: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;