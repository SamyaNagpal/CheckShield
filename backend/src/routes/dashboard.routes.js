const express = require('express');
const router = express.Router();
const { urlScanHistory, emailScanHistory, upiScanHistory } = require('../store/history');

// Equivalent of: @app.get("/dashboard-stats")
router.get('/dashboard-stats', (req, res) => {
  let highRisk = 0, mediumRisk = 0, lowRisk = 0;

  const countRisk = (history) => {
    for (const scan of history) {
      if (scan.risk_level === 'HIGH RISK') highRisk++;
      else if (scan.risk_level === 'MEDIUM RISK') mediumRisk++;
      else lowRisk++;
    }
  };

  countRisk(urlScanHistory);
  countRisk(emailScanHistory);
  countRisk(upiScanHistory);

  const totalScans = urlScanHistory.length + emailScanHistory.length + upiScanHistory.length;

  return res.json({
    total_scans: totalScans,
    threats_detected: highRisk + mediumRisk,
    high_risk_alerts: highRisk,
    safe_verified: lowRisk
  });
});

// Equivalent of: @app.get("/threat-distribution")
router.get('/threat-distribution', (req, res) => {
  const urlCount = urlScanHistory.length;
  const emailCount = emailScanHistory.length;
  const upiCount = upiScanHistory.length;
  const total = urlCount + emailCount + upiCount;

  if (total === 0) {
    return res.json({ phishing: 0, email: 0, upi: 0, qr: 0 });
  }

  return res.json({
    phishing: Math.round((urlCount / total) * 100),
    email: Math.round((emailCount / total) * 100),
    upi: Math.round((upiCount / total) * 100),
    qr: 0 // matches your Python exactly
  });
});

module.exports = router;