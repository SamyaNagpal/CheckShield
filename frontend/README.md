# CheckShield - AI Cyber Fraud Detection Platform

A modern React-based cybersecurity dashboard for detecting phishing, email scams, UPI fraud, and QR code attacks.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Recharts** - Data visualization (optional)
- **Vanilla CSS** - Styling

## Project Structure

```
checkshield-frontend/
├── src/
│   ├── main.js              # React app entry point
│   ├── App.js               # Main app component with routing
│   ├── api.js               # Backend API client
│   ├── css/
│   │   └── global.css       # All styling
│   ├── components/
│   │   ├── Sidebar.js       # Navigation sidebar
│   │   └── Navbar.js        # Top navbar
│   └── pages/
│       ├── Dashboard.js     # Main dashboard
│       ├── URLScanner.js    # URL phishing scanner
│       ├── EmailScanner.js  # Email scam detection
│       ├── UPIProtection.js # UPI fraud analyzer
│       ├── QRScanner.js     # QR code scanner
│       ├── Analytics.js     # Performance metrics
│       ├── ScanHistory.js   # Scan history table
│       └── Settings.js      # User settings
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Setup & Installation

### Prerequisites
- Node.js 14+ and npm

### Install Dependencies

```bash
npm install
```

This will install:
- react (18.2.0)
- react-dom (18.2.0)
- axios (1.6.0)
- recharts (2.10.0)
- vite (5.0.0)
- @vitejs/plugin-react (4.2.0)

### Start Development Server

```bash
npm run dev
```

The app will open in your browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Backend Setup

The app expects a FastAPI backend running on `http://127.0.0.1:8000`. Make sure your backend is running before using the scanners.

Update the API base URL in `src/api.js` if needed:

```javascript
const API_BASE = 'http://127.0.0.1:8000';
```

## Features

- **Dashboard**: Overview of security metrics and threat statistics
- **URL Scanner**: Detect phishing and malicious URLs
- **Email Scanner**: Identify scam emails and spam patterns
- **UPI Protection**: Analyze SMS for UPI fraud detection
- **QR Scanner**: Decode and analyze QR codes for threats
- **Analytics**: View detection rates and performance metrics
- **Scan History**: Browse all previous scans with filtering
- **Settings**: Configure user preferences and security options

## Dark Theme

The app features a cybersecurity-themed dark interface with:
- Navy primary background (#0f172a)
- Blue accents (#3b82f6)
- Red danger indicators (#ef4444)
- Professional card-based layout

## No External Dependencies

This project uses:
- Plain JavaScript (no TypeScript)
- Vanilla CSS (no Tailwind, SASS, or preprocessors)
- Minimal dependencies (React, ReactDOM, Axios, Recharts)

## Code Style

The code is intentionally simple and readable:
- No complex abstractions
- Clear variable names
- Basic React patterns (useState, component functions)
- Easy to understand and modify

## License

MIT
