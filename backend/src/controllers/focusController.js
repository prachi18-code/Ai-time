import mongoose from 'mongoose';
import FocusSession from '../models/FocusSession.js';
import Task from '../models/Task.js';
import { memoryDb } from '../config/memoryDb.js';

// @desc    Log a completed focus session
// @route   POST /api/focus-sessions
// @access  Private
export const logFocusSession = async (req, res) => {
  try {
    const { durationMinutes, taskId } = req.body;
    const userId = req.user.id || req.user._id;

    if (!durationMinutes) {
      return res.status(400).json({ message: 'Duration in minutes is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const session = await FocusSession.create({
        userId,
        taskId: taskId || null,
        durationMinutes: Number(durationMinutes),
        date: new Date(),
      });
      return res.status(201).json(session);
    } else {
      // Fallback
      const mockId = 'mock_session_' + Math.random().toString(36).substr(2, 9);
      const newSession = {
        _id: mockId,
        id: mockId,
        userId,
        taskId: taskId || null,
        durationMinutes: Number(durationMinutes),
        date: new Date(),
        createdAt: new Date(),
      };
      memoryDb.focusSessions.push(newSession);
      return res.status(201).json(newSession);
    }
  } catch (error) {
    console.error('Log focus session error:', error.message);
    res.status(500).json({ message: 'Server error logging focus session' });
  }
};

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    let sessions = [];
    let completedTasksCount = 0;
    let pendingTasksCount = 0;
    let inProgressTasksCount = 0;
    let allUserSessions = [];

    if (mongoose.connection.readyState === 1) {
      // MongoDB queries
      sessions = await FocusSession.find({
        userId,
        date: { $gte: sevenDaysAgo },
      });
      allUserSessions = await FocusSession.find({ userId }).sort({ date: -1 });
      completedTasksCount = await Task.countDocuments({ userId, status: 'completed' });
      pendingTasksCount = await Task.countDocuments({ userId, status: 'pending' });
      inProgressTasksCount = await Task.countDocuments({ userId, status: 'in-progress' });
    } else {
      // Fallback queries
      sessions = memoryDb.focusSessions.filter(
        s => String(s.userId) === String(userId) && new Date(s.date) >= sevenDaysAgo
      );
      allUserSessions = memoryDb.focusSessions
        .filter(s => String(s.userId) === String(userId))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      const userTasks = memoryDb.tasks.filter(t => String(t.userId) === String(userId));
      completedTasksCount = userTasks.filter(t => t.status === 'completed').length;
      pendingTasksCount = userTasks.filter(t => t.status === 'pending').length;
      inProgressTasksCount = userTasks.filter(t => t.status === 'in-progress').length;
    }

    // Sum focus minutes
    const totalFocusMinutes = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // Group focus minutes by day of week for "Study Velocity"
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const studyVelocity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      studyVelocity.push({
        day: dayName,
        dateString: d.toISOString().split('T')[0],
        minutes: 0,
      });
    }

    sessions.forEach(session => {
      const sessionDateStr = new Date(session.date).toISOString().split('T')[0];
      const dayObj = studyVelocity.find(s => s.dateString === sessionDateStr);
      if (dayObj) {
        dayObj.minutes += session.durationMinutes;
      }
    });

    const formattedStudyVelocity = studyVelocity.map(s => ({
      day: s.day,
      minutes: s.minutes,
    }));

    // Calculate Streak
    let streak = 0;
    if (allUserSessions.length > 0) {
      const sessionDates = new Set(
        allUserSessions.map(s => new Date(s.date).toISOString().split('T')[0])
      );

      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (sessionDates.has(todayStr) || sessionDates.has(yesterdayStr)) {
        let currentStreakDate = sessionDates.has(todayStr) ? new Date() : yesterday;
        
        while (true) {
          const dateStr = currentStreakDate.toISOString().split('T')[0];
          if (sessionDates.has(dateStr)) {
            streak++;
            currentStreakDate.setDate(currentStreakDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    // Tasks Statistics
    const totalTasksCount = completedTasksCount + pendingTasksCount + inProgressTasksCount;

    // Calculate Productivity Score
    const taskCompletionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 40 : 25;
    const focusRate = Math.min((totalFocusMinutes / 200) * 40, 40);
    const streakRate = Math.min((streak / 5) * 20, 20);
    const productivityScore = Math.round(taskCompletionRate + focusRate + streakRate);

    res.status(200).json({
      totalFocusMinutes,
      streak: streak || 1,
      completedTasks: completedTasksCount,
      pendingTasks: pendingTasksCount + inProgressTasksCount,
      productivityScore: Math.min(productivityScore, 100) || 75,
      studyVelocity: formattedStudyVelocity,
    });
  } catch (error) {
    console.error('Analytics retrieval error:', error.message);
    res.status(500).json({ message: 'Server error retrieving analytics data' });
  }
};
