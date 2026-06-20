import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { memoryDb } from '../config/memoryDb.js';

// @desc    Get all user tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (mongoose.connection.readyState === 1) {
      const tasks = await Task.find({ userId }).sort({ deadline: 1 });
      return res.status(200).json(tasks);
    } else {
      // Fallback
      const tasks = memoryDb.tasks
        .filter(t => String(t.userId) === String(userId))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      return res.status(200).json(tasks);
    }
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Server error retrieving tasks' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, subject, deadline, priority, estimatedMinutes, difficulty } = req.body;
    const userId = req.user.id || req.user._id;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const task = await Task.create({
        userId,
        title,
        subject: subject || 'General',
        deadline: new Date(deadline),
        priority: priority || 'medium',
        estimatedMinutes: Number(estimatedMinutes) || 30,
        difficulty: difficulty || 'medium',
        status: 'pending',
      });
      return res.status(201).json(task);
    } else {
      // Fallback
      const mockId = 'mock_task_' + Math.random().toString(36).substr(2, 9);
      const newTask = {
        _id: mockId,
        id: mockId,
        userId,
        title,
        subject: subject || 'General',
        deadline: new Date(deadline),
        priority: priority || 'medium',
        estimatedMinutes: Number(estimatedMinutes) || 30,
        difficulty: difficulty || 'medium',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryDb.tasks.push(newTask);
      return res.status(201).json(newTask);
    }
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, subject, deadline, priority, estimatedMinutes, difficulty, status } = req.body;
    const userId = req.user.id || req.user._id;
    const taskId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const task = await Task.findOne({ _id: taskId, userId });

      if (!task) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      if (title) task.title = title;
      if (subject) task.subject = subject;
      if (deadline) task.deadline = new Date(deadline);
      if (priority) task.priority = priority;
      if (estimatedMinutes) task.estimatedMinutes = Number(estimatedMinutes);
      if (difficulty) task.difficulty = difficulty;
      if (status) task.status = status;

      const updatedTask = await task.save();
      return res.status(200).json(updatedTask);
    } else {
      // Fallback
      const taskIndex = memoryDb.tasks.findIndex(t => String(t._id) === String(taskId) && String(t.userId) === String(userId));
      
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      const existingTask = memoryDb.tasks[taskIndex];
      const updatedTask = {
        ...existingTask,
        title: title || existingTask.title,
        subject: subject || existingTask.subject,
        deadline: deadline ? new Date(deadline) : existingTask.deadline,
        priority: priority || existingTask.priority,
        estimatedMinutes: estimatedMinutes !== undefined ? Number(estimatedMinutes) : existingTask.estimatedMinutes,
        difficulty: difficulty || existingTask.difficulty,
        status: status || existingTask.status,
        updatedAt: new Date(),
      };

      memoryDb.tasks[taskIndex] = updatedTask;
      return res.status(200).json(updatedTask);
    }
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const taskId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const task = await Task.findOne({ _id: taskId, userId });

      if (!task) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      await task.deleteOne();
      return res.status(200).json({ id: taskId, message: 'Task deleted successfully' });
    } else {
      // Fallback
      const taskIndex = memoryDb.tasks.findIndex(t => String(t._id) === String(taskId) && String(t.userId) === String(userId));
      
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      memoryDb.tasks.splice(taskIndex, 1);
      return res.status(200).json({ id: taskId, message: 'Task deleted successfully' });
    }
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};
