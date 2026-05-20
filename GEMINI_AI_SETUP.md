# CheckShield - AI Content Improvement Feature Setup Guide

## Overview

The community feed now includes an "Improve with AI" feature powered by Google's Gemini API. Users can click a button to improve their posts (title/description) using AI before posting.

## Features

- **✨ Improve Title**: Polish the title of your report
- **✨ Improve Description**: Enhance the detailed description
- **Side-by-side comparison**: See original vs improved text
- **Accept/Reject**: Choose whether to accept the AI suggestions
- **Professional formatting**: Improves grammar, clarity, and professional tone

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" or "Create new API key"
3. Select your project (or create a new one)
4. Copy the API key

### 2. Add API Key to Environment Variables

**For Local Development:**

Edit your `.env` file in the backend directory:

```bash
# backend/.env
GEMINI_API_KEY=your_api_key_here
```

**For Production:**

Add the environment variable to your hosting platform (Heroku, Railway, Render, etc.):

```
GEMINI_API_KEY=your_api_key_here
```

### 3. Install Dependencies

The Gemini package is already added to `package.json`. Install it:

```bash
cd backend
npm install
```

### 4. Test the Feature

1. Start your backend server:
   ```bash
   npm start
   ```

2. Go to your CheckShield site
3. Click "Create Post"
4. Type some text in the title or description
5. Click "✨ Improve with AI"
6. Review the suggestion and click "✓ Accept & Update" or "✕ Reject"

## API Endpoints

### Improve Text
```
POST /api/community/improve-text
Content-Type: application/json

{
  "text": "your text here"
}

Response:
{
  "original": "your text here",
  "improved": "Your improved text here.",
  "message": "Text improved successfully"
}
```

### Improve Full Post
```
POST /api/community/improve-post
Content-Type: application/json

{
  "title": "post title",
  "description": "post description"
}

Response:
{
  "original": { "title": "...", "description": "..." },
  "improved": { "improvedTitle": "...", "improvedDescription": "..." },
  "message": "Post improved successfully"
}
```

### Generate Security Tips
```
POST /api/community/generate-tips
Content-Type: application/json

{
  "text": "incident description"
}

Response:
{
  "tips": "Security tips based on the incident",
  "message": "Security tips generated successfully"
}
```

## Features Included

### Backend (`src/services/gemini.service.js`)

1. **improveText(text)** - Improves any text
   - Corrects grammar
   - Improves clarity and professionalism
   - Keeps original meaning intact

2. **improvePost(title, description)** - Improves title and description together
   - Returns both improved texts in JSON format
   - Maintains context between title and description

3. **generateSecurityTips(text)** - Creates security tips from incident description
   - Generates 3-4 actionable security tips
   - Formatted for community users

### Frontend (Community.jsx)

1. **"✨ Improve with AI" buttons** on title and description fields
2. **Suggestion Modal** showing side-by-side comparison
3. **Accept/Reject buttons** to apply or discard suggestions
4. **Loading states** while improving text

## Error Handling

### Common Issues

**"Gemini API key not configured"**
- Solution: Make sure GEMINI_API_KEY is set in your .env file

**"Failed to parse Gemini response"**
- Solution: Check your API key validity and rate limits

**API Call Fails**
- Check that backend is running
- Verify CORS is enabled (it is by default)
- Check browser console for detailed error messages

## Best Practices

1. **Keep it concise**: AI works best with specific, focused text
2. **Review suggestions**: Always review AI-generated content before posting
3. **Provide context**: More detailed input = better suggestions
4. **Rate limits**: Be mindful of Gemini API rate limits (varies by plan)

## Future Enhancements

Potential features to add:

- [ ] Batch improve multiple posts
- [ ] AI-generated security tips based on post content
- [ ] Tone adjustment (more formal/casual)
- [ ] Language translation
- [ ] Auto-tagging based on content analysis
- [ ] Spam/harmful content detection

## Cost Considerations

Google Gemini API has:
- **Free tier**: 60 requests per minute, limited daily quota
- **Paid tier**: Higher quotas with pay-as-you-go pricing
- **Monthly billing**: Check Google AI pricing page for details

For production use, monitor your API usage in Google Cloud Console.

## Support

For issues:

1. Check that all environment variables are set correctly
2. Verify Gemini API key is valid
3. Check backend logs for detailed error messages
4. Review [Google Generative AI Documentation](https://ai.google.dev/docs)

## Environment Variables Reference

```bash
# Required for AI features
GEMINI_API_KEY=your_google_generative_ai_key

# Optional (existing backend variables)
PORT=8000
MONGODB_URI=mongodb://localhost:27017/checkshield
JWT_SECRET=your_jwt_secret
```

## Integration with Existing Features

The AI improvement feature:
- ✅ Works with all security categories (Email, URL, QR, UPI, etc.)
- ✅ Doesn't interfere with existing post creation flow
- ✅ Is completely optional (users can post without using AI)
- ✅ Respects user input (AI is suggestion-based)

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: Production Ready
