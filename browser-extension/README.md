# CheckShield Browser Extension

A Chrome browser extension for real-time URL phishing and fraud detection powered by your CheckShield backend.

## Features

- **Real-Time URL Scanning**: Scan any URL to detect phishing, malware, and fraud risks
- **Risk Assessment**: Get detailed risk scores and analysis for each URL
- **Scan History**: Keep track of your recent scans with easy access
- **Custom Backend**: Configure your own CheckShield backend API URL
- **Visual Indicators**: Color-coded risk levels (High, Medium, Low)
- **Quick Access**: Scan current page with one click
- **Notifications**: Get browser notifications for scan results

## Installation

### Prerequisites

- Google Chrome, Edge, Brave, or any Chromium-based browser
- CheckShield backend running (default: http://localhost:8000)

### Steps to Install

1. **Clone or Download the Extension**
   - The extension files should be in `c:\CheckShield\browser-extension\`

2. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your browser
   - Or: Settings → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

4. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Navigate to the `browser-extension` folder
   - Select and open the folder

5. **Extension Loaded**
   - CheckShield icon should appear in your extension toolbar
   - Pin it for easy access

## Usage

### Basic URL Scan

1. Click the CheckShield extension icon
2. Enter a URL in the input field
3. Click "Scan" or press Enter
4. View the risk analysis and details

### Scan Current Page

1. Click the CheckShield extension icon
2. Click "Scan Current Page"
3. The current page URL will be analyzed

### View Settings

1. Click the extension icon
2. Click the ⚙️ Settings button
3. Configure:
   - **Backend API URL**: Change if running on a different server
   - **Auto-scan on page load**: Automatically scan pages (optional)
   - **Show notifications**: Get desktop notifications for results

### View History

- Recent scans appear in the "Recent Scans" section
- Click any history item to rescan that URL
- Click "Clear History" to remove all scans

## Configuration

### Changing Backend API URL

1. Open the extension popup
2. Click ⚙️ Settings
3. Update "Backend API URL"
4. Default: `http://localhost:8000`

### Remote Backend

If your backend is on a different server:

1. Make sure CORS is enabled on your backend (already configured in CheckShield)
2. Update the API URL to: `http://your-backend-url:8000`
3. Save settings

## Risk Levels

- **HIGH**: Strong indicators of phishing, malware, or fraud. Avoid visiting.
- **MEDIUM**: Some suspicious characteristics. Visit with caution.
- **LOW**: Appears safe based on analysis.

## API Endpoints Used

The extension communicates with your backend's URL scanning endpoint:

- **Endpoint**: `POST /analyze`
- **Body**: `{ "url": "https://example.com" }`
- **Response**: Risk analysis with score and level

## File Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.css              # Popup styling
├── popup.js               # Popup logic and API calls
├── background.js          # Background service worker
├── content.js             # Content script for web pages
└── icons/
    ├── icon-16.svg        # Small icon
    ├── icon-48.svg        # Medium icon
    └── icon-128.svg       # Large icon
```

## Troubleshooting

### Extension Not Connecting to Backend

- Ensure backend is running on `http://localhost:8000`
- Check Settings for correct API URL
- Verify CORS is enabled on backend (it is by default in CheckShield)
- Check browser console for errors (DevTools → Console)

### "Cannot fetch from API" Error

- Backend is not running - start it with `npm start`
- Backend URL is incorrect - update in Settings
- Network connectivity issue - check your internet connection

### Scans Not Working

- Reload the extension: `chrome://extensions` → Reload (circular arrow)
- Clear browser cache and restart
- Check that you're entering valid URLs

### Want Access to Dev Tools

- Right-click extension icon → Inspect popup
- Check console for error messages

## Building from Source

The extension is already built and ready to use. Files included:

- manifest.json - Already configured for Chrome
- All JavaScript, HTML, and CSS files ready to use
- SVG icons included

No build process required - simply load the folder as an unpacked extension.

## Security Notes

- The extension connects only to your configured CheckShield backend
- Scan history is stored locally in your browser (not sent anywhere)
- URLs are sent to your backend for analysis
- No personal data is collected or transmitted
- Privacy is maintained by using your own backend

## Future Enhancements

Potential features for future versions:

- Email scanning integration
- QR code scanning protection
- UPI transaction protection
- Scan result caching
- Context menu integration
- Performance optimizations
- Multi-language support

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review browser console for error messages
3. Verify backend is running and accessible
4. Check backend logs for API errors

## License

Part of the CheckShield project. See main project LICENSE file.

## Changelog

### Version 1.0.0

- Initial release
- URL scanning functionality
- Settings panel
- Scan history
- Real-time analysis
- Risk assessment and reporting
