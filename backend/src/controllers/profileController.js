import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryDb } from '../config/memoryDb.js';

// @desc    Get user profile settings
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } else {
      // Fallback
      const user = memoryDb.users.find(u => String(u._id) === String(userId));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile settings
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (req.body.name) user.name = req.body.name;
      if (req.body.preferredStudyHours) user.preferredStudyHours = req.body.preferredStudyHours;
      if (req.body.dailyAvailableTime !== undefined) user.dailyAvailableTime = Number(req.body.dailyAvailableTime);
      if (req.body.notificationPreference !== undefined) user.notificationPreference = req.body.notificationPreference;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      
      return res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        preferredStudyHours: updatedUser.preferredStudyHours,
        dailyAvailableTime: updatedUser.dailyAvailableTime,
        notificationPreference: updatedUser.notificationPreference,
      });
    } else {
      // Fallback
      const userIndex = memoryDb.users.findIndex(u => String(u._id) === String(userId));

      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingUser = memoryDb.users[userIndex];
      const updatedUser = {
        ...existingUser,
        name: req.body.name || existingUser.name,
        preferredStudyHours: req.body.preferredStudyHours || existingUser.preferredStudyHours,
        dailyAvailableTime: req.body.dailyAvailableTime !== undefined ? Number(req.body.dailyAvailableTime) : existingUser.dailyAvailableTime,
        notificationPreference: req.body.notificationPreference !== undefined ? req.body.notificationPreference : existingUser.notificationPreference,
      };

      memoryDb.users[userIndex] = updatedUser;

      const { password, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error updating profile settings' });
  }
};
