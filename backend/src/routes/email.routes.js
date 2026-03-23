const express = require('express');
const router = express.Router();
const { analyzeEmail } = require('../services/ml.service');
const { emailScanHistory } = require('../store/history');

router.post('/analyze-email', async (req, res) => {
  try {
    const { email_text } = req.body;
    if (!email_text) return res.status(400).json({ detail: 'email_text is required' });

    const result = await analyzeEmail(email_text);
    emailScanHistory.push(result);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

router.get('/analytics-email', (req, res) => {
  if (emailScanHistory.length === 0) {
    return res.json({ total_email_scans: 0, message: 'No email scans yet.' });
  }

  const totalScans = emailScanHistory.length;
  const avgRisk = emailScanHistory.reduce((s, x) => s + x.email_risk_score, 0) / totalScans;
  const riskDistribution = emailScanHistory.reduce((acc, x) => {
    acc[x.risk_level] = (acc[x.risk_level] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    total_email_scans: totalScans,
    average_email_risk: Math.round(avgRisk * 100) / 100,
    risk_distribution: riskDistribution
  });
});

module.exports = router;