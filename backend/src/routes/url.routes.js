const express = require('express');
const router = express.Router();
const { analyzeUrl } = require('../services/ml.service');
const { urlScanHistory } = require('../store/history');

router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ detail: 'url is required' });

    const result = await analyzeUrl(url);

    if (result.error) return res.status(400).json({ detail: result.error });

    urlScanHistory.push(result);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

router.get('/analytics', (req, res) => {
  if (urlScanHistory.length === 0) {
    return res.json({ total_url_scans: 0, message: 'No URL scans yet.' });
  }

  const totalScans = urlScanHistory.length;
  const avgRisk = urlScanHistory.reduce((s, x) => s + x.risk_score, 0) / totalScans;
  const riskDistribution = urlScanHistory.reduce((acc, x) => {
    acc[x.risk_level] = (acc[x.risk_level] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    total_url_scans: totalScans,
    average_url_risk: Math.round(avgRisk * 100) / 100,
    risk_distribution: riskDistribution
  });
});

module.exports = router;