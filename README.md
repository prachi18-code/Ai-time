# Aether AI | Cosmic Time Management Coach (MVP)

A fullstack time management and productivity coach built for students, inspired by Stitch's premium "Aether AI" dark-mode glassmorphic styling, using Hinglish interface copy.

## Key Features
- **Hinglish AI Coach Chat**: Interactive Aether AI Coach chatbot guiding placement prep, GATE, midsems, and focus.
- **AI Smart Planner**: Task manager that organizes tasks by priority/difficulty and dynamically schedules daily time blocks.
- **Aether OS Pomodoro Timer**: Glowing circular Pomodoro countdown timer with active task logging.
- **Weekly Analytics**: Interactive study velocity area charts, streak tracking, and task completion metrics.
- **Robust Offline Fallbacks**: Work fully out-of-the-box! If OpenAI API key or MongoDB database connection is pending/unconfigured, the system automatically shifts to local scheduling algorithms and fallback Hinglish chat advice engines.

---

## Technology Stack

- **Frontend**: React (v19) + Vite (v8) + Tailwind CSS (v4) + Recharts + Lucide Icons
- **Backend**: Node.js + Express + MongoDB (Mongoose) + OpenAI Node SDK

---

## Directory Layout

```
ai time/
├── backend/            # Express REST APIs & OpenAI integration
│   ├── src/
│   │   ├── config/     # MongoDB database configuration
│   │   ├── controllers/# Auth, Tasks, AI, Focus, Profile controllers
│   │   ├── middleware/ # JWT protection middleware
│   │   ├── models/     # User, Task, FocusSession, Schedule schemas
│   │   ├── routes/     # Route endpoints definitions
│   │   └── server.js   # Express app initialization
│   └── .env            # Environment configuration
│
├── frontend/           # React + Vite + Tailwind CSS app
│   ├── src/
│   │   ├── assets/     # SVG assets & logos
│   │   ├── components/ # Floating bottom dock, Glass Cards, guards
│   │   ├── context/    # Auth context & state manager
│   │   ├── pages/      # Tab pages (Dashboard, Planner, Focus, Coach, Stats, Profile)
│   │   ├── services/   # Fetch API request wrappers
│   │   └── index.css   # Neon glow classes & design tokens
│   └── index.html      # SEO metadata & Google Fonts
│
└── package.json        # Root scripts to run concurrently
```

---

## Setup & Running Guide

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed locally.

### 2. Environment Variables (.env)
Open the backend configuration file `backend/.env` and update the values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aether_coach
JWT_SECRET=super_secret_aether_key_12345
OPENAI_API_KEY=your_openai_api_key_here
```
*Note: If no OpenAI API Key is provided, the local Hinglish smart scheduler and coach chatbot fallbacks will automatically handle requests.*

### 3. Run the Application
Navigate to the root directory `ai time` and execute:
```bash
# Start both frontend and backend concurrently in dev mode
npm run dev
```

Alternatively, you can run them individually:
```bash
# Run backend dev server only
npm run backend

# Run frontend dev server only
npm run frontend
```

Access the frontend dashboard at `http://localhost:5173`.
The backend runs at `http://localhost:5000`.

---

## Interface copy guide (Hinglish Style)
- Dashboard greeting: *"Namaste, Seeker! Ready to flow?"*
- Daily plan header: *"Aaj Ka Plan"*
- Pomodoro start control: *"START FLOW"*
- Log out: *"Account Log Out Karo"*
- Settings feedback: *"Preferences update ho gayi hain, Dost! 🌟"*
