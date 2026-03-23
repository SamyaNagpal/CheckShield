require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

connectDB();


const urlRoutes = require('./routes/url.routes');
const emailRoutes = require('./routes/email.routes');
const upiRoutes = require('./routes/upi.routes');
const qrRoutes = require('./routes/qr.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const authRoutes = require('./routes/auth.routes');
const communityRoutes = require('./routes/community.routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Equivalent of: CORSMiddleware(allow_origins=["*"])
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: true
}));

app.use(express.json());

// Health check — equivalent of: @app.get("/")
app.get('/', (req, res) => {
  res.json({
    message: 'CheckShield Security API is running.',
    modules: [
      'URL Phishing Detection',
      'Email Scam Detection',
      'UPI Scam Detection',
      'QR Scam Detection'
    ]
  });
});

app.use('/auth', authRoutes);
app.use('/', urlRoutes);
app.use('/', emailRoutes);
app.use('/', upiRoutes);
app.use('/', qrRoutes);
app.use('/', dashboardRoutes);
app.use('/', communityRoutes);

app.listen(PORT, () => {
  console.log(`CheckShield Node backend running on http://localhost:${PORT}`);
});