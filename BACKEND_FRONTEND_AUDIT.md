# URL Phishing Module - Backend vs Frontend Audit

## 📊 Data Availability Analysis

### Backend (Python ML Service) - `final_decision_engine.py`

Returns the following data in response:

```python
{
  "url": "string",
  "risk_score": 0-100,
  "risk_level": "HIGH RISK|MEDIUM RISK|LOW RISK",
  "ml_probability": 0-100,          # ML model confidence
  "rule_risk": 0-100,               # Rule-based engine result
  "blacklist_flag": true|false,     # VirusTotal detection
  "reasons": ["string", ...]        # Threat indicators list
}
```

### Frontend Display - `URLScanner.jsx`

Currently displaying:

```javascript
{
  url: data.url,                    ✅ DISPLAYED
  riskScore: data.risk_score,       ✅ DISPLAYED (large visual)
  riskLevel: data.risk_level,       ✅ DISPLAYED (badge)
  reasons: data.reasons             ✅ DISPLAYED (threat indicators)
}
```

---

## 📋 Feature Comparison

| Backend Data         | Type    | Used?      | Displayed? | Notes                             |
| -------------------- | ------- | ---------- | ---------- | --------------------------------- |
| `url`                | string  | ✅         | ✅         | Shown at top of report            |
| `risk_score`         | number  | ✅         | ✅         | Main display with color-coded bar |
| `risk_level`         | string  | ✅         | ✅         | Badge at top-right                |
| `reasons`            | array   | ✅         | ✅         | Listed as threat indicators       |
| **`ml_probability`** | number  | ✅ Backend | ❌         | **HIDDEN** - as requested         |
| **`rule_risk`**      | number  | ✅ Backend | ❌         | **NOT DISPLAYED**                 |
| **`blacklist_flag`** | boolean | ✅ Backend | ❌         | **NOT DISPLAYED**                 |

---

## 🔍 What's Missing/Hidden

### 1. **ML Probability** (Intentionally Hidden ✓)

- Backend calculates: ML model's phishing confidence
- Status: Hidden from frontend (as per your request)
- Could show: Technical metric for power users

### 2. **Rule Risk Score** (Hidden - Worth Displaying?)

- Backend calculates: Pure rule-based analysis result
- Current status: Calculated but never displayed
- Could show: "Analysis Method Breakdown" section

### 3. **Blacklist Flag** (Hidden)

- Backend checks: VirusTotal malware database
- Current status: Used to set final_risk to 100, but flag not shown
- Could show: ⚠️ "FLAGGED BY VIRUSTOTAL" badge when true

### 4. **Analysis Breakdown** (Not Available)

- Could show: "ML: 75% confidence → Final: 82% after filtering"
- Would help users understand how final score is calculated

---

## 💡 Improvement Suggestions

### Option A: Add Transparency Panel

Show how score was calculated:

```
Risk Score: 82%
├─ ML Analysis: 75%
├─ Rule Analysis: 88%
├─ Method: Hybrid Decision (weighted)
└─ Data Sources: VirusTotal, Heuristics
```

### Option B: Add VirusTotal Indicator

When `blacklist_flag` is true:

```
🚨 MALWARE ALERT
This URL is flagged as malicious by VirusTotal
[View Report] [Report False Positive]
```

### Option C: Add Analysis Method Badge

Show which detection method was most influential:

```
PRIMARY DETECTION METHOD:
┌─────────────────────────┐
│ Rule-Based Detection ✓  │  (88% confidence)
│ ML Detection           │  (75% confidence)
│ Blacklist Check        │  (Not flagged)
└─────────────────────────┘
```

---

## 📈 API Response Chain

```
Frontend Input: URL
    ↓
Backend Route: POST /analyze (Express)
    ↓
Python Service: /ml/analyze-url (FastAPI)
    ↓
📊 final_decision_engine.py
    ├─ Extract features
    ├─ ML prediction (Random Forest)
    ├─ Rule-based analysis
    ├─ VirusTotal check
    └─ Fusion (weighted decision)
    ↓
Response: Complete analysis object
    ↓
Frontend: URLScanner.jsx
    ├─ Extract: url, risk_score, risk_level, reasons
    ├─ Hide: ml_probability (as requested)
    └─ Missing: rule_risk, blacklist_flag, analysis_method
```

---

## ✅ Recommendations

**CURRENTLY** - Everything essential is displayed ✓

**COULD IMPROVE** by showing:

1. VirusTotal malware detection status (when flagged)
2. Analysis method breakdown (optional for advanced users)
3. Rule vs ML comparison (transparency feature)

**NOT RECOMMENDED**:

- Showing raw ML probability (inaccurate per your feedback)
- Showing raw rule_risk separately (confusing with final score)

---

## 🔧 Quick Reference: Available Data Not Being Used

```python
# These fields are calculated by backend but never shown to user:

data.ml_probability         # ML confidence (0-100)
data.rule_risk              # Rule engine score (0-100)
data.blacklist_flag         # VirusTotal detection (bool)

# These use the above data internally:
data.risk_score             # Final fused score = final_risk
data.risk_level             # HIGH RISK / MEDIUM RISK / LOW RISK
data.reasons                # User-friendly threat descriptions
```
