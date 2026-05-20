#!/usr/bin/env node

/**
 * Gemini API Diagnostic Test
 * Run this to diagnose Gemini API issues
 */

require('dotenv').config();

async function testGeminiAPI() {
  console.log('🔍 CheckShield Gemini API Diagnostic\n');
  console.log('=====================================\n');

  // 1. Check environment variable
  console.log('1️⃣  Checking GEMINI_API_KEY...');
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY not found in .env\n');
    return;
  }
  
  console.log(`✅ API Key found (length: ${apiKey.length})`);
  console.log(`✅ Format valid (starts with: AIza*)\n`);

  // 2. Try to initialize Google Generative AI
  console.log('2️⃣  Initializing Google Generative AI client...');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const client = new GoogleGenerativeAI(apiKey);
    console.log('✅ Client initialized successfully\n');

    // 3. Try to get model
    console.log('3️⃣  Connecting to gemini-2.0-flash model...');
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('✅ Model object created\n');

    // 4. Try a test API call
    console.log('4️⃣  Sending test request to Gemini API...');
    console.log('   (This may take a few seconds...)\n');

    const result = await model.generateContent('Say "Hello from CheckShield" in one word only');
    const response = await result.response;
    const text = response.text();

    console.log('✅ API Call Successful!\n');
    console.log(`📝 Response: "${text}"\n`);
    console.log('✅ Gemini API is working correctly!\n');
    console.log('🎉 You can now use the "Improve with AI" feature!\n');

  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);

    if (error.message.includes('fetch failed')) {
      console.log('💡 Troubleshooting "fetch failed" error:');
      console.log('  • Check your internet connection');
      console.log('  • Verify API key is not revoked');
      console.log('  • Try regenerating a fresh API key from: aistudio.google.com/app/apikey\n');
    } else if (error.message.includes('404')) {
      console.log('💡 Model not found - try using a different model\n');
    } else if (error.message.includes('401') || error.message.includes('permission')) {
      console.log('💡 Authentication failed:');
      console.log('  • API key might be invalid or revoked');
      console.log('  • Generate a new one from: aistudio.google.com/app/apikey\n');
    } else if (error.message.includes('quota')) {
      console.log('💡 Quota exceeded - upgrade to paid plan\n');
    }

    console.log(`📋 Full error: ${error.message}\n`);
  }

  console.log('=====================================');
  console.log('Next steps:');
  console.log('1. If test passed: Restart your backend (npm run dev)');
  console.log('2. If test failed: Fix the error above and try again\n');
}

testGeminiAPI();
