import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { memoryDb } from '../config/memoryDb.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_aether_key_12345');

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback to in-memory db
        const user = memoryDb.users.find(u => String(u._id) === String(decoded.id));
        if (user) {
          const { password, ...userWithoutPassword } = user;
          // Format user object matching mongoose structure
          req.user = { 
            _id: user._id,
            id: user._id,
            ...userWithoutPassword 
          };
        }
      }
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, unauthorized' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
