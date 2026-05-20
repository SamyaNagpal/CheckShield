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

// Health check for Gemini API
router.get('/api/community/health/gemini', async (req, res) => {
  try {
    const geminiService = require('../services/gemini.service');
    const validation = geminiService.validateApiKey();
    
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: `API key validation failed: ${validation.error}`,
        apiKeySet: !!process.env.GEMINI_API_KEY,
        apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
      });
    }

    res.json({
      status: 'ok',
      message: 'Gemini API key is configured correctly',
      apiKeySet: true,
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

// Get all community posts (paginated)
router.get('/api/community/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CommunityPost.countDocuments();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Get posts by category
router.get('/api/community/posts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CommunityPost.countDocuments({ category });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Create a new community post
router.post('/api/community/posts', async (req, res) => {
  try {
    const { title, description, category, severity, userId, userName } = req.body;

    if (!title || !description || !category || !userId || !userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newPost = new CommunityPost({
      title,
      description,
      category,
      severity: severity || 'medium',
      author: {
        id: userId,
        name: userName
      }
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Upvote a post
router.post('/api/community/posts/:postId/upvote', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already upvoted
    if (post.upvotedBy.includes(userId)) {
      // Remove upvote
      post.upvotedBy = post.upvotedBy.filter(id => id.toString() !== userId);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      // Add upvote
      post.upvotedBy.push(userId);
      post.upvotes += 1;
    }

    await post.save();
    res.json({ message: 'Post upvote updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Error updating upvote', error: error.message });
  }
});

// Add reply to a post
router.post('/api/community/posts/:postId/reply', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName, content } = req.body;

    if (!userId || !userName || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.replies.push({
      userId,
      userName,
      content,
      createdAt: new Date()
    });

    await post.save();
    res.json({ message: 'Reply added successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
});

// Get single post by ID
router.get('/api/community/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
});

// Delete a post (only by owner)
router.delete('/api/community/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await CommunityPost.deleteOne({ _id: postId });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

// AI: Improve text (description or title)
router.post('/api/community/improve-text', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const geminiService = require('../services/gemini.service');
    const improvedText = await geminiService.improveText(text);

    res.json({
      original: text,
      improved: improvedText,
      message: 'Text improved successfully'
    });
  } catch (error) {
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
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const geminiService = require('../services/gemini.service');
    const improved = await geminiService.improvePost(title, description);

    res.json({
      original: { title, description },
      improved: improved,
      message: 'Post improved successfully'
    });
  } catch (error) {
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
      return res.status(400).json({ message: 'Text is required' });
    }

    const geminiService = require('../services/gemini.service');
    const tips = await geminiService.generateSecurityTips(text);

    res.json({
      tips: tips,
      message: 'Security tips generated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error generating tips', 
      error: error.message 
    });
  }
});

module.exports = router;
