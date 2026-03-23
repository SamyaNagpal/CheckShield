const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

async function analyzeUrl(url) {
  const response = await axios.post(`${ML_URL}/ml/analyze-url`, { url });
  return response.data;
}

async function analyzeEmail(emailText) {
  const response = await axios.post(`${ML_URL}/ml/analyze-email`, {
    email_text: emailText
  });
  return response.data;
}

async function analyzeUpi(message) {
  const response = await axios.post(`${ML_URL}/ml/analyze-upi`, { message });
  return response.data;
}

// QR: Express already saved the file to disk via multer.
// We forward it to Python as multipart/form-data, exactly like the frontend did.
async function analyzeQr(filePath, originalName) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), originalName);

  const response = await axios.post(`${ML_URL}/ml/analyze-qr`, form, {
    headers: form.getHeaders()
  });
  return response.data;
}

module.exports = { analyzeUrl, analyzeEmail, analyzeUpi, analyzeQr };