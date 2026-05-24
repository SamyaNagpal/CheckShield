const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/Community');
const User = require('../models/User');

// Middleware to check authentication
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    // In a real app, verify JWT here
    // For now, we'll assume the frontend sends userId in headers
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Health check for Groq API
router.get('/api/community/health/groq', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      provider: 'Groq',
      apiKeySet: !!process.env.GROQ_API_KEY,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// AI: Improve text (description or title)
router.post('/api/community/improve-text', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: 'Text is required'
      });
    }

    const groqService = require('../services/groq.service');
    const improvedText = await groqService.improveText(text);

    res.json({
      original: text,
      improved: improvedText,
      message: 'Text improved successfully'
    });
  } catch (error) {
    console.error('Groq Error:', error);

    res.status(500).json({
      message: 'Error improving text',
      error: error.message
    });
  }
});

// AI: Improve entire post (title + description)
router.post('/api/community/improve-post', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    const groqService = require('../services/groq.service');
    const improved = await groqService.improvePost(
      title,
      description
    );

    res.json({
      original: {
        title,
        description
      },
      improved,
      message: 'Post improved successfully'
    });
  } catch (error) {
    console.error('Groq Error:', error);

    res.status(500).json({
      message: 'Error improving post',
      error: error.message
    });
  }
});

// AI: Generate security tips from post content
router.post('/api/community/generate-tips', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: 'Text is required'
      });
    }

    const groqService = require('../services/groq.service');
    const tips = await groqService.generateSecurityTips(text);

    res.json({
      tips,
      message: 'Security tips generated successfully'
    });
  } catch (error) {
    console.error('Groq Error:', error);

    res.status(500).json({
      message: 'Error generating tips',
      error: error.message
    });
  }
});

module.exports = router;