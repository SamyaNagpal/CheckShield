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

export default api;