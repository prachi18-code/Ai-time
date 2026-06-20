import mongoose from 'mongoose';

const timeBlockSchema = new mongoose.Schema({
  startTime: {
    type: String, // HH:MM
    required: true,
  },
  endTime: {
    type: String, // HH:MM
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
  activityType: {
    type: String, // e.g. "study", "break", "leisure"
    default: "study",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    timeBlocks: [timeBlockSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one generated schedule per day string
scheduleSchema.index({ userId: 1, date: 1 }, { unique: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
