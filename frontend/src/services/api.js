const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper: Make HTTP request with token and handle responses
const request = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  // Auth API
  register: (name, email, password) => 
    request('/auth/register', 'POST', { name, email, password }),
  
  login: (email, password) => 
    request('/auth/login', 'POST', { email, password }),
  
  getMe: (token) => 
    request('/auth/me', 'GET', null, token),

  // Tasks API
  getTasks: (token) => 
    request('/tasks', 'GET', null, token),
  
  createTask: (taskData, token) => 
    request('/tasks', 'POST', taskData, token),
  
  updateTask: (taskId, taskData, token) => 
    request(`/tasks/${taskId}`, 'PUT', taskData, token),
  
  deleteTask: (taskId, token) => 
    request(`/tasks/${taskId}`, 'DELETE', null, token),

  // Focus & Analytics API
  logFocusSession: (durationMinutes, taskId, token) => 
    request('/focus-sessions', 'POST', { durationMinutes, taskId }, token),
  
  getWeeklyAnalytics: (token) => 
    request('/analytics/weekly', 'GET', null, token),

  // AI API
  generateSchedule: (token) => 
    request('/ai/generate-schedule', 'POST', null, token),
  
  chatWithCoach: (messages, token) => 
    request('/ai/chat', 'POST', { messages }, token),

  // Profile API
  getProfile: (token) => 
    request('/profile', 'GET', null, token),
  
  updateProfile: (profileData, token) => 
    request('/profile', 'PUT', profileData, token),
};
