# Email Phishing Module - Backend vs Frontend Audit

## 📊 Data Availability Analysis

### Backend (Python ML Service) - `email_decision_engine.py`

Returns the following data in response:

```python
{
  "email_risk_score": 0-100,              # Final aggregated score
  "risk_level": "CRITICAL RISK|HIGH RISK|MEDIUM RISK|LOW RISK",
  "ml_spam_probability": 0-100,           # ML model confidence
  "rule_risk": 0-100,                     # Rule-based engine score
  "max_url_risk": 0-100,                  # Highest phishing URL risk found
  "urls_analyzed": [                      # Array of detected URLs with full analysis
    {
      "url": "string",
      "risk_score": 0-100,
      "risk_level": "string",
      "reasons": ["string"],
      ...
    }
  ],
  "reasons": ["string", ...]              # Threat indicators list
}
```

### Frontend Display - `EmailScanner.jsx`

Currently displaying:

```javascript
{
  riskLevel: data.risk_level,             ✅ DISPLAYED (badge + emoji)
  riskScore: data.email_risk_score,       ✅ DISPLAYED (visual bar)
  reasons: data.reasons                   ✅ DISPLAYED (threat list)
}
```

---

## 📋 Feature Comparison

| Backend Data              | Type   | Used?      | Displayed? | Notes                                |
| ------------------------- | ------ | ---------- | ---------- | ------------------------------------ |
| `email_risk_score`        | number | ✅         | ✅         | Final score with visual bar          |
| `risk_level`              | string | ✅         | ✅         | Badge with emoji indicator           |
| `reasons`                 | array  | ✅         | ✅         | Threat indicators list               |
| **`ml_spam_probability`** | number | ✅ Backend | ❌         | **HIDDEN** - as requested            |
| **`rule_risk`**           | number | ✅ Backend | ❌         | **NOT DISPLAYED**                    |
| **`max_url_risk`**        | number | ✅ Backend | ❌         | **NOT DISPLAYED - HIGH VALUE**       |
| **`urls_analyzed`**       | array  | ✅ Backend | ❌         | **NOT DISPLAYED - CRITICAL FEATURE** |

---

## 🔍 What's Missing/Hidden

### 1. **ML Spam Probability** (Intentionally Hidden ✓)

- Backend calculates: ML spam detection confidence
- Status: Hidden from frontend (as per your request)
- Type: Inaccurate metric

### 2. **Rule Risk Score** (Hidden)

- Backend calculates: Pure rule-based analysis (0-100)
- Current status: Calculated but never displayed
- How it scores:
  - Suspicious phrases: +5 each ("urgent", "verify", "account suspended", etc.)
  - Financial keywords: +3 each ("bank", "payment", "invoice", etc.)
  - Excessive exclamation marks (>5): +5
  - Multiple ALL-CAPS words (>3): +5
- Could show: "Pattern-based scoring analysis"

### 3. **Max URL Risk** (Hidden - Worth Displaying!)

- Backend detects: ALL URLs in email and checks them against URL phishing detector
- Current status: Detected but not shown to user
- Value: Critical! User needs to know if emails contain dangerous links
- Could show: "⚠️ Detected malicious URL in email"

### 4. **URLs Analyzed Array** (Hidden - Most Important Missing Feature!)

- Backend provides: Full details of each URL found in email
  - Each URL's full risk analysis
  - Individual risk scores
  - Threat reasons for each URL
- Current status: Completely hidden from user
- Should show: URL detection section with:

  ```
  URLs Detected in Email: 2

  1. https://suspicious-paypal-verify.com
     Risk: 88% (HIGH RISK)
     Issues: Suspicious TLD, Brand spoofing, Phishing keywords

  2. https://example.com/safe
     Risk: 15% (LOW RISK)
     Issues: None detected
  ```

---

## 🔧 How Email Risk is Calculated

```python
final_risk = (ml_spam_probability × 0.6) + (rule_risk × 0.2) + (max_url_risk × 0.2)

Example:
- ML says 65% spam
- Rules detect 40 points risk
- Email contains URL with 80% phishing risk
- Final = (65 × 0.6) + (40 × 0.2) + (80 × 0.2) = 39 + 8 + 16 = 63%
```

---

## 💡 Improvement Recommendations

### 🔴 **CRITICAL** - Add URL Detection Section

Show detected URLs and their individual risks. This is a major feature that's completely hidden:

```
DETECTED URLs IN EMAIL:
├─ https://paypal-verify-account.com
│  ├─ Risk: 92% (HIGH RISK)
│  ├─ Reason: Brand spoofing detected
│  ├─ Reason: Phishing keywords
│  └─ Action: [Don't Click]
│
└─ https://example.com
   ├─ Risk: 12% (LOW RISK)
   └─ Action: Safe to click
```

### 🟡 **IMPORTANT** - Add Analysis Breakdown

Show how final score was calculated:

```
RISK CALCULATION BREAKDOWN:
├─ Email Patterns: 40%
├─ Threat Keywords: Rule detection active
├─ Embedded URLs: [2 URLs found - show each]
└─ Final Score: 63%
```

### 🟢 **OPTIONAL** - Show Rule Details

Explain which specific rules were triggered:

```
TRIGGERED RULES:
✓ Suspicious phrase: "verify your account"
✓ Suspicious phrase: "immediately"
✓ Financial keyword: "bank"
```

---

## 📈 API Response Chain

```
Frontend Input: Email text
    ↓
Backend Route: POST /analyze-email (Express)
    ↓
Python Service: /ml/analyze-email (FastAPI)
    ↓
📧 email_decision_engine.py
    ├─ Clean text & extract URLs
    ├─ ML spam detection (TF-IDF)
    ├─ Rule-based analysis
    ├─ For each URL found:
    │   └─ Call URL phishing analyzer (get risk score)
    ├─ Weighted aggregation (ML 60% + Rules 20% + URLs 20%)
    └─ Generate risk level & reasons
    ↓
Response: Complete analysis object with URLs
    ↓
Frontend: EmailScanner.jsx
    ├─ Extract: email_risk_score, risk_level, reasons
    ├─ Hide: ml_spam_probability (as requested)
    └─ Missing: rule_risk, max_url_risk, urls_analyzed ❌❌❌
```

---

## ✅ What Should Be Added

**MOST IMPORTANT - Add URL Detection Section:**

```javascript
// New section to add:
{
  urls_analyzed && urls_analyzed.length > 0 && (
    <div className="urls-section">
      <h3>🔗 URLs Detected in Email ({urls_analyzed.length})</h3>
      {urls_analyzed.map((url, idx) => (
        <div className="url-result">
          <div className="url-text">{url.url}</div>
          <div className="url-risk">Risk: {url.risk_score}%</div>
          <div className="url-level">{url.risk_level}</div>
          <div className="url-reasons">
            {url.reasons.map((reason) => (
              <div>{reason}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**SECONDARY - Add Rule Analysis Breakdown:**

```javascript
// Show rule_risk and what triggered it
<div className="analysis-breakdown">
  <div>Pattern Analysis: {rule_risk}%</div>
  <div>Max URL Risk: {max_url_risk}%</div>
  <div>Final Score: {email_risk_score}%</div>
</div>
```

---

## 📊 Current vs Recommended Coverage

| Feature        | Current   | Recommended        |
| -------------- | --------- | ------------------ |
| Risk Level     | ✅ Show   | ✅ Show            |
| Risk Score     | ✅ Show   | ✅ Show            |
| Threat Reasons | ✅ Show   | ✅ Show            |
| URL Detection  | ❌ Hidden | 🔴 ADD - Critical  |
| Rule Analysis  | ❌ Hidden | 🟡 ADD - Important |
| ML Probability | ❌ Hidden | ✅ Keep Hidden     |

---

## 🎯 Summary

**What's Working:**

- ✅ Final risk score displayed correctly
- ✅ Risk level badge with emoji
- ✅ Threat indicators from rules

**What's Critically Missing:**

- ❌ URL detection section (2-3 links in email completely invisible to user!)
- ❌ Individual URL risk analysis
- ❌ Analysis breakdown/explanation

**The Big Issue:**
Email backend analyzes every URL in the email and scores them, but frontend NEVER shows this. A user could paste an email with 5 phishing links, and the frontend would show the overall risk but NOT which specific URLs are dangerous.
