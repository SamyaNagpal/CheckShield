# Quick Start - CheckShield Browser Extension

## ⚡ 60-Second Setup

### 1. Open Chrome Extensions

```
Type in address bar: chrome://extensions/
```

### 2. Enable Developer Mode

Toggle "Developer mode" in top right corner

### 3. Load Extension

- Click "Load unpacked"
- Select: `C:\CheckShield\browser-extension`
- Done ✓

## 🚀 First Scan

1. Click CheckShield icon (top right)
2. Paste a URL or click "Scan Current Page"
3. See results instantly!

## ⚙️ Initial Setup (Optional)

1. Click extension → ⚙️ Settings
2. If backend is NOT on localhost:8000, update the URL
3. Save and you're ready!

## 🎯 Common Tasks

| Task                     | How To                        |
| ------------------------ | ----------------------------- |
| **Scan a URL**           | Paste URL + Click Scan        |
| **Scan current page**    | Click "Scan Current Page"     |
| **View history**         | Scroll to "Recent Scans"      |
| **Clear history**        | Click "Clear History"         |
| **Change API URL**       | Settings ⚙️ → Backend API URL |
| **Enable notifications** | Settings ⚙️ → Enable checkbox |

## 🟢 Understanding Results

```
🟢 LOW RISK       = Appears safe
🟡 MEDIUM RISK    = Some concerns, visit cautiously
🔴 HIGH RISK      = Likely malicious, don't visit
```

## ❓ Need Help?

**Extension not working?**

- Is backend running? → Start: `npm start` in backend folder
- Get error? → Check Settings → Is API URL correct?
- Still broken? → Right-click icon → Inspect → Check Console

**Backend on different machine?**

- Settings → Update API URL: `http://your-server-ip:8000`

That's it! Happy scanning! 🛡️
