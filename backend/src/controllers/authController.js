import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryDb } from '../config/memoryDb.js';

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_aether_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (mongoose.connection.readyState === 1) {
      // MongoDB Active
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredStudyHours: user.preferredStudyHours,
          dailyAvailableTime: user.dailyAvailableTime,
          token: generateToken(user._id),
        });
      }
    } else {
      // MongoDB Offline - In-Memory Fallback
      console.log('MongoDB Offline. Performing registration in-memory...');
      const userExists = memoryDb.users.find(u => u.email === email.toLowerCase().trim());
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password manually since we are bypass Mongoose pre-save
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockId = 'mock_user_' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        _id: mockId,
        id: mockId,
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        preferredStudyHours: "09:00-18:00",
        dailyAvailableTime: 240,
        notificationPreference: true,
      };

      memoryDb.users.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        preferredStudyHours: newUser.preferredStudyHours,
        dailyAvailableTime: newUser.dailyAvailableTime,
        token: generateToken(newUser._id),
      });
    }

    return res.status(400).json({ message: 'Invalid user data' });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      // MongoDB Active
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredStudyHours: user.preferredStudyHours,
          dailyAvailableTime: user.dailyAvailableTime,
          token: generateToken(user._id),
        });
      }
    } else {
      // MongoDB Offline - In-Memory Fallback
      console.log('MongoDB Offline. Performing login in-memory...');
      const user = memoryDb.users.find(u => u.email === email.toLowerCase().trim());
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredStudyHours: user.preferredStudyHours,
          dailyAvailableTime: user.dailyAvailableTime,
          token: generateToken(user._id),
        });
      }
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};
