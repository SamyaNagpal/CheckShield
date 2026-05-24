import axios from 'axios';

const API_BASE = 'https://checkshield-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── AUTH ────────────────────────────────────────────
export async function registerUser(name, email, password) {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
}

export async function loginUser(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
}

export async function getMe() {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Session expired');
  }
}

// ─── SCANNERS ─────────────────────────────────────────
export async function scanURL(url) {
  try {
    const response = await api.post('/analyze', { url });
    return response.data;
  } catch (error) {
    throw new Error('Unable to connect to scanner service. Make sure the backend is running.');
  }
}

export async function scanEmail(email) {
  try {
    const response = await api.post('/analyze-email', { email_text: email });
    return response.data;
  } catch (error) {
    throw new Error('Unable to connect to email scanner. Make sure the backend is running.');
  }
}

export async function scanUPI(message) {
  try {
    const response = await api.post('/analyze-upi', { message });
    return response.data;
  } catch (error) {
    throw new Error('Unable to connect to UPI scanner. Make sure the backend is running.');
  }
}

export async function scanQR(formData) {
  try {
    const response = await axios.post(`${API_BASE}/analyze-qr`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Unable to connect to QR scanner. Make sure the backend is running.');
  }
}

// ─── DASHBOARD ───────────────────────────────────────

export async function getDashboardStats() {
  try {
    const response = await api.get('/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_scans: 0,
      threats_detected: 0,
      safe_verified: 0
    };
  }
}

export async function getThreatDistribution() {
  try {
    const response = await api.get('/threat-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching threat distribution:', error);
    return {
      safe: 0,
      dangerous: 0
    };
  }
}

export async function getRecentActivity() {
  try {
    const response = await api.get('/dashboard/recent-activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export default api;