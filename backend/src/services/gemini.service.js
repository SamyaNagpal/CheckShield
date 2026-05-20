const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Warning: GEMINI_API_KEY not set in environment variables');
    }
    this.client = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.cache = new Map(); // Simple text improvement cache
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
  }

  /**
   * Retry helper with exponential backoff
   */
  async retryWithBackoff(fn, retries = this.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error.message.includes('fetch failed')) {
        console.log(`Retrying... (${this.maxRetries - retries + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryWithBackoff(fn, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Validate API key format
   */
  validateApiKey() {
    if (!this.apiKey) {
      return { valid: false, error: 'GEMINI_API_KEY not set' };
    }
    
    if (!this.apiKey.startsWith('AIza')) {
      return { valid: false, error: 'API key format invalid. Should start with "AIza"' };
    }
    
    if (this.apiKey.length < 39) {
      return { valid: false, error: 'API key too short' };
    }
    
    return { valid: true };
  }

  /**
   * Get cache key from text
   */
  getCacheKey(text) {
    return `improve:${text.slice(0, 50)}`; // Use first 50 chars as key
  }

  /**
   * Check if improvement is cached
   */
  getFromCache(text) {
    const key = this.getCacheKey(text);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log('Cache hit for text improvement');
      return cached.improved;
    }
    
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    return null;
  }

  /**
   * Save to cache
   */
  saveToCache(text, improved) {
    const key = this.getCacheKey(text);
    this.cache.set(key, {
      improved,
      timestamp: Date.now()
    });
  }

  /**
   * Improve text using Gemini API
   * Takes layman language and improves it to be more professional and clear
   * @param {string} text - The text to improve
   * @returns {Promise<string>} - The improved text
   */
  async improveText(text) {
    try {
      // Validate API key
      const validation = this.validateApiKey();
      if (!validation.valid) {
        throw new Error(`API Key Error: ${validation.error}`);
      }

      if (!this.client) {
        throw new Error('Gemini client not initialized. Please check GEMINI_API_KEY.');
      }

      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      // Check cache first
      const cached = this.getFromCache(text);
      if (cached) {
        return cached;
      }

      const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `You are a professional writing assistant. Your task is to improve the following text by:
1. Making it more professional and clear
2. Correcting any grammatical errors
3. Improving sentence structure
4. Keeping the original meaning and intent intact
5. Making it more concise if possible
6. Ensuring it's appropriate for a community security forum

Original text:
${text}

Please provide the improved version only, without any explanations or comments.`;

      // Retry with backoff on network failures
      const result = await this.retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });

      const response = await result.response;
      const improvedText = response.text();

      // Save to cache
      this.saveToCache(text, improvedText.trim());

      return improvedText.trim();
    } catch (error) {
      const details = {
        message: error.message,
        name: error.name,
        status: error.status,
        apiKeySet: !!this.apiKey,
        apiKeyValid: this.validateApiKey().valid,
        timestamp: new Date().toISOString()
      };
      
      console.error('Gemini Error Details:', details);
      
      // Provide helpful error messages
      if (error.message.includes('fetch failed')) {
        throw new Error('Network error connecting to Gemini API. Check your internet connection or API key.');
      } else if (error.message.includes('API Key Error')) {
        throw new Error(error.message);
      } else if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please upgrade your plan or try again later.');
      }
      
      throw new Error(`Failed to improve text: ${error.message}`);
    }
  }

  /**
   * Improve multiple fields (title and description)
   * @param {string} title - The title to improve
   * @param {string} description - The description to improve
   * @returns {Promise<Object>} - Object with improvedTitle and improvedDescription
   */
  async improvePost(title, description) {
    try {
      if (!this.client) {
        throw new Error('Gemini API key not configured');
      }

      const cacheKey = `post:${title.slice(0, 30)}:${description.slice(0, 30)}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('Cache hit for post improvement');
        return cached.result;
      }

      const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `You are a professional writing assistant for a community security forum. 
Your task is to improve the following post by making it more professional, clear, and appropriate for a security community.

Original Title:
${title}

Original Description:
${description}

Please provide the improved version in JSON format like this:
{
  "title": "improved title here",
  "description": "improved description here"
}

Ensure the improvements are minimal but effective - correct grammar, improve clarity, make it more professional while keeping the original intent.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse Gemini response');
      }

      const improved = JSON.parse(jsonMatch[0]);
      const result_obj = {
        improvedTitle: improved.title || title,
        improvedDescription: improved.description || description
      };

      // Save to cache
      this.cache.set(cacheKey, {
        result: result_obj,
        timestamp: Date.now()
      });

      return result_obj;
    } catch (error) {
      console.error('Error improving post with Gemini:', error);
      throw new Error(`Failed to improve post: ${error.message}`);
    }
  }

  /**
   * Generate security awareness tips based on content
   * @param {string} text - The security incident text
   * @returns {Promise<string>} - Security tips
   */
  async generateSecurityTips(text) {
    try {
      if (!this.client) {
        throw new Error('Gemini API key not configured');
      }

      // Check cache first
      const cacheKey = `tips:${text.slice(0, 50)}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('Cache hit for security tips');
        return cached.tips;
      }

      const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `Based on the following security incident description, provide 3-4 concise security tips to help users avoid similar scams:

Incident:
${text}

Provide the tips in a bullet point format, keeping each tip clear and actionable.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const tips = response.text().trim();

      // Save to cache
      this.cache.set(cacheKey, {
        tips: tips,
        timestamp: Date.now()
      });

      return tips;
    } catch (error) {
      console.error('Error generating security tips:', error);
      throw new Error(`Failed to generate tips: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
