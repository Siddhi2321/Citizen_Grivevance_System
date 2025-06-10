const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
  officer_id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, // Store hashed password using bcrypt or similar
  },
  designation: {
    type: String, // e.g., Junior Engineer, Sanitation Inspector
    required: true,
  },
  department: {
    type: String, // e.g., Water Supply, Public Works
    required: true,
  },
  location: {
    state: { type: String, default: "Maharashtra" },
    district: { type: String },
    city: { type: String },
    pincode: { type: String }
  },
  role: {
    type: String,
    enum: ["officer", "admin"],
    default: "officer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("officer", officerSchema);
