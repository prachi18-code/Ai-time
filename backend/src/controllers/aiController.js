import { OpenAI } from 'openai';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Schedule from '../models/Schedule.js';
import { memoryDb } from '../config/memoryDb.js';

// Setup OpenAI client if API key is present
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return null;
  }
  return new OpenAI({ apiKey });
};

// Local scheduler fallback
const generateLocalSchedule = (tasks, preferredHours, dailyAvailableMinutes) => {
  let startHour = 9;
  let startMinute = 0;
  if (preferredHours && preferredHours.includes('-')) {
    const startPart = preferredHours.split('-')[0].trim();
    const timeParts = startPart.split(':');
    if (timeParts.length === 2) {
      startHour = parseInt(timeParts[0]) || 9;
      startMinute = parseInt(timeParts[1]) || 0;
    }
  }

  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
  });

  const timeBlocks = [];
  let currentHour = startHour;
  let currentMinute = startMinute;
  let totalScheduledMinutes = 0;

  const formatTime = (h, m) => {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const addMinutes = (h, m, minutesToAdd) => {
    let newM = m + minutesToAdd;
    let newH = h + Math.floor(newM / 60);
    newM = newM % 60;
    newH = newH % 24;
    return [newH, newM];
  };

  for (const task of sortedTasks) {
    if (totalScheduledMinutes >= dailyAvailableMinutes) break;

    const taskMinutes = Math.min(task.estimatedMinutes || 45, dailyAvailableMinutes - totalScheduledMinutes);
    const startStr = formatTime(currentHour, currentMinute);
    const [nextH, nextM] = addMinutes(currentHour, currentMinute, taskMinutes);
    const endStr = formatTime(nextH, nextM);

    timeBlocks.push({
      startTime: startStr,
      endTime: endStr,
      taskTitle: task.title,
      activityType: 'study',
      isCompleted: false,
    });

    currentHour = nextH;
    currentMinute = nextM;
    totalScheduledMinutes += taskMinutes;

    if (totalScheduledMinutes < dailyAvailableMinutes) {
      const breakMinutes = 15;
      const breakStart = formatTime(currentHour, currentMinute);
      const [breakEndH, breakEndM] = addMinutes(currentHour, currentMinute, breakMinutes);
      const breakEnd = formatTime(breakEndH, breakEndM);

      timeBlocks.push({
        startTime: breakStart,
        endTime: breakEnd,
        taskTitle: 'Chai Break ☕ & Stretch',
        activityType: 'break',
        isCompleted: false,
      });

      currentHour = breakEndH;
      currentMinute = breakEndM;
      totalScheduledMinutes += breakMinutes;
    }
  }

  if (totalScheduledMinutes < dailyAvailableMinutes) {
    const remaining = dailyAvailableMinutes - totalScheduledMinutes;
    const startStr = formatTime(currentHour, currentMinute);
    const [nextH, nextM] = addMinutes(currentHour, currentMinute, remaining);
    const endStr = formatTime(nextH, nextM);

    timeBlocks.push({
      startTime: startStr,
      endTime: endStr,
      taskTitle: 'Aether Free Flow (Self Review/Revision)',
      activityType: 'study',
      isCompleted: false,
    });
  }

  return timeBlocks;
};

// @desc    Generate daily schedule using AI (or local fallback)
// @route   POST /api/ai/generate-schedule
// @access  Private
export const generateSchedule = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const dateStr = new Date().toISOString().split('T')[0];

    const preferredHours = req.user.preferredStudyHours || "09:00-18:00";
    const dailyAvailableTime = req.user.dailyAvailableTime || 240;

    let tasks = [];

    if (mongoose.connection.readyState === 1) {
      tasks = await Task.find({
        userId,
        status: { $in: ['pending', 'in-progress'] },
      });
    } else {
      tasks = memoryDb.tasks.filter(
        t => String(t.userId) === String(userId) && (t.status === 'pending' || t.status === 'in-progress')
      );
    }

    if (tasks.length === 0) {
      return res.status(400).json({
        message: 'Bhai, schedule banane ke liye pehle tasks toh add karo! Smart Planner me jaakar add some tasks.',
      });
    }

    const openai = getOpenAIClient();

    // Check if we should run fallback (no OpenAI key)
    if (!openai) {
      console.log('OpenAI Key not set or invalid. Running local smart scheduler fallback...');
      const localTimeBlocks = generateLocalSchedule(tasks, preferredHours, dailyAvailableTime);

      let schedule = null;

      if (mongoose.connection.readyState === 1) {
        schedule = await Schedule.findOne({ userId, date: dateStr });
        if (schedule) {
          schedule.timeBlocks = localTimeBlocks;
          await schedule.save();
        } else {
          schedule = await Schedule.create({
            userId,
            date: dateStr,
            timeBlocks: localTimeBlocks,
          });
        }
      } else {
        // Fallback save in memoryDb
        const schedIndex = memoryDb.schedules.findIndex(s => String(s.userId) === String(userId) && s.date === dateStr);
        if (schedIndex !== -1) {
          memoryDb.schedules[schedIndex].timeBlocks = localTimeBlocks;
          schedule = memoryDb.schedules[schedIndex];
        } else {
          schedule = {
            _id: 'mock_schedule_' + Math.random().toString(36).substr(2, 9),
            userId,
            date: dateStr,
            timeBlocks: localTimeBlocks,
          };
          memoryDb.schedules.push(schedule);
        }
      }

      return res.status(200).json({
        schedule,
        coachingTip: "Aether offline core: Aaj ka local plan set kar diya hai. Ab start ho jao without delays!",
        isFallback: true,
      });
    }

    // Prepare OpenAI prompt
    const taskDetails = tasks.map(t => ({
      title: t.title,
      subject: t.subject,
      priority: t.priority,
      difficulty: t.difficulty,
      estimatedMinutes: t.estimatedMinutes,
    }));

    const systemPrompt = `You are Aether AI, a smart schedule generator. You take a list of student tasks, study hour preferences, and total available daily minutes, and arrange them into structured, optimal time blocks.
Return ONLY a valid JSON array of objects. Do not include markdown code block formatting (like \`\`\`json) or extra text.
Each object in the array must look exactly like:
{
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "taskTitle": "Task Name or Chai Break",
  "activityType": "study" or "break" or "leisure"
}
Guidelines:
1. Start scheduling around ${preferredHours.split('-')[0].trim()}.
2. Respect total available minutes: ${dailyAvailableTime}. Do not schedule more minutes than this.
3. Insert 10-15 minute breaks between intense study tasks.
4. Schedule higher priority tasks first.
5. Provide a realistic day schedule that maximizes student focus.`;

    const userPrompt = `Tasks to schedule: ${JSON.stringify(taskDetails)}. Preferred study time: ${preferredHours}. Daily limit: ${dailyAvailableTime} minutes.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
    });

    let resultText = response.choices[0].message.content.trim();
    if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    const timeBlocks = JSON.parse(resultText);
    let schedule = null;

    if (mongoose.connection.readyState === 1) {
      schedule = await Schedule.findOne({ userId, date: dateStr });
      if (schedule) {
        schedule.timeBlocks = timeBlocks;
        await schedule.save();
      } else {
        schedule = await Schedule.create({
          userId,
          date: dateStr,
          timeBlocks,
        });
      }
    } else {
      const schedIndex = memoryDb.schedules.findIndex(s => String(s.userId) === String(userId) && s.date === dateStr);
      if (schedIndex !== -1) {
        memoryDb.schedules[schedIndex].timeBlocks = timeBlocks;
        schedule = memoryDb.schedules[schedIndex];
      } else {
        schedule = {
          _id: 'mock_schedule_' + Math.random().toString(36).substr(2, 9),
          userId,
          date: dateStr,
          timeBlocks,
        };
        memoryDb.schedules.push(schedule);
      }
    }

    const tipResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are Aether AI. Write a single sentence, high-energy coaching tip in Hinglish (Hindi + English) motivating the student to complete this new daily schedule.'
        },
        {
          role: 'user',
          content: 'Keep it short, punchy, and highly motivational.'
        }
      ],
      max_tokens: 60,
    });

    const coachingTip = tipResponse.choices[0].message.content.trim();

    res.status(200).json({
      schedule,
      coachingTip,
      isFallback: false,
    });

  } catch (error) {
    console.error('Schedule generation error:', error.message);
    
    // Recovery Fallback
    try {
      const userId = req.user.id || req.user._id;
      const dateStr = new Date().toISOString().split('T')[0];
      let tasks = [];
      if (mongoose.connection.readyState === 1) {
        tasks = await Task.find({ userId, status: { $in: ['pending', 'in-progress'] } });
      } else {
        tasks = memoryDb.tasks.filter(t => String(t.userId) === String(userId) && (t.status === 'pending' || t.status === 'in-progress'));
      }
      
      const localTimeBlocks = generateLocalSchedule(tasks, req.user.preferredStudyHours, req.user.dailyAvailableTime);
      let schedule = null;

      if (mongoose.connection.readyState === 1) {
        schedule = await Schedule.findOne({ userId, date: dateStr });
        if (schedule) {
          schedule.timeBlocks = localTimeBlocks;
          await schedule.save();
        } else {
          schedule = await Schedule.create({ userId, date: dateStr, timeBlocks: localTimeBlocks });
        }
      } else {
        const schedIndex = memoryDb.schedules.findIndex(s => String(s.userId) === String(userId) && s.date === dateStr);
        if (schedIndex !== -1) {
          memoryDb.schedules[schedIndex].timeBlocks = localTimeBlocks;
          schedule = memoryDb.schedules[schedIndex];
        } else {
          schedule = {
            _id: 'mock_schedule_' + Math.random().toString(36).substr(2, 9),
            userId,
            date: dateStr,
            timeBlocks: localTimeBlocks,
          };
          memoryDb.schedules.push(schedule);
        }
      }

      res.status(200).json({
        schedule,
        coachingTip: "Glitch detected in scheduling engine. Local backup plan has been loaded successfully! Let's get going!",
        isFallback: true,
      });
    } catch (fallbackErr) {
      res.status(500).json({ message: 'Error scheduling tasks. Add tasks and verify details.' });
    }
  }
};

const getLocalCoachResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('exam') || msg.includes('test') || msg.includes('gate') || msg.includes('midsem')) {
    return "Exam season aa raha hai? Tension mat lo! Syllabus ko micro-tasks me divide karo aur daily Pomodoro focus sessions complete karo. Revise daily, formula sheets create karo. Consistent raho, ho jayega! 🔥";
  }
  if (msg.includes('focus') || msg.includes('distraction') || msg.includes('phone') || msg.includes('instagram')) {
    return "Focus issue hai? Simple approach: Pomodoro timer start karo. Phone ko screen-down silent kar do aur target complete hone se pehle touch mat karo. 25 minutes absolute work, 5 mins break! 🎯";
  }
  if (msg.includes('placement') || msg.includes('job') || msg.includes('interview') || msg.includes('dsa') || msg.includes('leetcode')) {
    return "Placement preparation solid karni hai? Daily target: 2 DSA coding problems + 1 Core computer science topic revision (OS, DBMS or OOPS). Routine is key! 💻";
  }
  if (msg.includes('stress') || msg.includes('burnout') || msg.includes('tired') || msg.includes('demotivate')) {
    return "Tired feel ho raha hai? It's fine to take a breath. Chill out for 15 minutes, ☕ chai-coffee break lo aur stretch karo. Distractions avoid karo aur clear target set karo.";
  }
  if (msg.includes('time') || msg.includes('planner') || msg.includes('manage') || msg.includes('schedule')) {
    return "Time table follow nahi hota? Subah uthte hi 'Generate AI Schedule' trigger karo. Chrono-timeline target maintain karo aur analytics section me streak badhao! ⚡";
  }
  
  const generalResponses = [
    "Namaste Seeker! Aaj ka target kaisa chal raha hai? Mujhse schedule metrics, study hacks ya motivation tips discuss karo.",
    "Aether online core is operating. Batao Seeker, engineering prep ya DSA target me se kis plan ko clear karna hai?",
    "Goals clear hain toh action flow automatically badhta hai. Kaunse pending study block se aaj starting karni hai?"
  ];

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

// @desc    Chat with Aether AI Coach
// @route   POST /api/ai/chat
// @access  Private
export const chatWithCoach = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const latestUserMessage = messages[messages.length - 1].content;
    const openai = getOpenAIClient();

    if (!openai) {
      console.log('OpenAI key not active. Running local Hinglish coach engine...');
      const fallbackReply = getLocalCoachResponse(latestUserMessage);
      return res.status(200).json({
        reply: fallbackReply,
        isFallback: true,
      });
    }

    const systemPrompt = `You are Aether AI, an advanced, highly motivating, cosmic time management and productivity coach for Indian students.
You communicate in Hinglish (a natural, friendly mix of English and Hindi written in the Latin/English alphabet).
Use terms like: 'Bhai', 'Seeker', 'Aaj ka target', 'Dost', 'Phodna hai', 'Concentration', 'Distractions', 'Aether Flow'.
Keep your advice structured, actionable, and full of energy. Give advice on placements (LeetCode, DSA, resume), exams (GATE, midsems), and time management. Keep responses concise (under 150 words) so they look great on screen.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content,
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 250,
    });

    const reply = response.choices[0].message.content.trim();

    res.status(200).json({
      reply,
      isFallback: false,
    });

  } catch (error) {
    console.error('Chat controller error:', error.message);
    const fallbackReply = getLocalCoachResponse(messages[messages.length - 1].content);
    res.status(200).json({
      reply: fallbackReply,
      isFallback: true,
    });
  }
};
