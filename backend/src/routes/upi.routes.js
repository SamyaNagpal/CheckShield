const express = require('express');
const router = express.Router();
const { analyzeUpi } = require('../services/ml.service');
const { upiScanHistory } = require('../store/history');

router.post('/analyze-upi', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ detail: 'message is required' });

    const result = await analyzeUpi(message);
    upiScanHistory.push(result);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

router.get('/analytics-upi', (req, res) => {
  if (upiScanHistory.length === 0) {
    return res.json({ total_upi_scans: 0, message: 'No UPI scans yet.' });
  }

  const totalScans = upiScanHistory.length;
  // Note: UPI uses "final_risk" as the score key (from your app.py line:
  // avg_risk = sum(scan["final_risk"] for scan in upi_scan_history))
  const avgRisk = upiScanHistory.reduce((s, x) => s + x.final_risk, 0) / totalScans;
  const riskDistribution = upiScanHistory.reduce((acc, x) => {
    acc[x.risk_level] = (acc[x.risk_level] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    total_upi_scans: totalScans,
    average_upi_risk: Math.round(avgRisk * 100) / 100,
    risk_distribution: riskDistribution
  });
});

module.exports = router;