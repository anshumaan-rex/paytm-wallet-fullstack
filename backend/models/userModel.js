import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must have at least 3 characters"],
    maxlength: [40, "Name should be under 40 characters"],
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: [30, "Username can have up to 30 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [64, "Password should be under 64 characters"],
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
