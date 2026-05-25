// Default API URL
const DEFAULT_API_URL = 'http://localhost:8000';

// DOM Elements
const urlInput = document.getElementById('urlInput');
const scanBtn = document.getElementById('scanBtn');
const currentPageBtn = document.getElementById('currentPageBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const resultCard = document.getElementById('resultCard');
const historyList = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.querySelector('.close');
const apiUrlInput = document.getElementById('apiUrl');
const autoScanCheckbox = document.getElementById('autoScan');
const notificationsCheckbox = document.getElementById('notifications');
const saveSettingsBtn = document.getElementById('saveSettings');

// Load settings on popup open
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSettings();
        loadHistory();
        urlInput.focus();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Scan button click handler
scanBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
        scanUrl(url);
    } else {
        showError('Please enter a valid URL');
    }
});

// Current page button click handler
currentPageBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        urlInput.value = currentUrl;
        scanUrl(currentUrl);
    });
});

// Enter key to scan
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        scanBtn.click();
    }
});

// Settings modal handlers
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    const apiUrl = apiUrlInput.value.trim() || DEFAULT_API_URL;
    const autoScan = autoScanCheckbox.checked;
    const notifications = notificationsCheckbox.checked;

    chrome.storage.sync.set({
        apiUrl: apiUrl,
        autoScan: autoScan,
        notifications: notifications
    }, () => {
        showSuccess('Settings saved!');
        setTimeout(() => {
            settingsModal.classList.add('hidden');
        }, 1000);
    });
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear scan history?')) {
        chrome.storage.local.set({ scanHistory: [] }, () => {
            historyList.innerHTML = '';
            showSuccess('History cleared');
        });
    }
});

// Scan URL function
async function scanUrl(url) {
    // Validate URL
    if (!isValidUrl(url)) {
        showError('Invalid URL format');
        return;
    }

    showLoading(true);
    results.classList.add('hidden');

    try {
        const apiUrl = await getApiUrl();
        const response = await fetch(`${apiUrl}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: url }),
            timeout: 10000
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API error: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data, url);
        addToHistory(url, data);

        // Show notification if enabled
        try {
            const settings = await getSetting('notifications');
            if (settings) {
                showNotification(url, data);
            }
        } catch (notifError) {
            console.warn('Notification setting check failed:', notifError);
        }
    } catch (error) {
        console.error('Error:', error);
        showError(`Error scanning URL: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Display results
function displayResults(data, url) {
    const riskLevel = data.risk_level || 'unknown';
    const riskScore = data.risk_score || 0;
    const riskClass = getRiskClass(riskLevel);
    
    const riskPercentage = Number(riskScore).toFixed(2);

    let html = `<div class="result-card ${riskClass}-risk">`;
    html += `<div class="result-header">`;
    html += `<span class="risk-level risk-${riskClass}">${escapeHtml(riskLevel.toUpperCase())}</span>`;
    html += `<span class="risk-score">${riskPercentage}%</span>`;
    html += `</div>`;
    html += `<div class="result-url">${escapeHtml(url)}</div>`;
    html += `<div class="result-details">`;

    if (data.analysis) {
        html += `<p><span class="detail-label">Analysis:</span> ${escapeHtml(data.analysis)}</p>`;
    }

    if (data.url_characteristics) {
        html += `<p><span class="detail-label">Type:</span> ${escapeHtml(JSON.stringify(data.url_characteristics))}</p>`;
    }

    if (data.features) {
        html += `<p><span class="detail-label">Features:</span></p><ul style="margin-left: 16px; font-size: 12px;">`;
        for (const [key, value] of Object.entries(data.features).slice(0, 3)) {
            html += `<li>${escapeHtml(key)}: ${escapeHtml(String(value))}</li>`;
        }
        html += `</ul>`;
    }

    html += `</div></div>`;

    resultCard.innerHTML = html;
    results.classList.remove('hidden');
}

// Add to history
function addToHistory(url, data) {
    chrome.storage.local.get({ scanHistory: [] }, (result) => {
        let history = result.scanHistory;
        history.unshift({
            url: url,
            risk_level: data.risk_level,
            risk_score: data.risk_score,
            timestamp: new Date().toISOString()
        });

        // Keep only last 20 items
        history = history.slice(0, 20);

        chrome.storage.local.set({ scanHistory: history }, () => {
            loadHistory();
        });
    });
}

// Load and display history
function loadHistory() {
    chrome.storage.local.get({ scanHistory: [] }, (result) => {
        const history = result.scanHistory;
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #999; font-size: 12px;">No scans yet</p>';
            return;
        }

        history.forEach((item) => {
            const riskClass = getRiskClass(item.risk_level || 'unknown');
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-url">${escapeHtml(item.url)}</div>
                <span class="history-risk ${riskClass}">${(item.risk_level || 'Unknown').toUpperCase()}</span>
            `;
            historyItem.addEventListener('click', () => {
                urlInput.value = item.url;
                scanUrl(item.url);
            });
            historyList.appendChild(historyItem);
        });
    });
}

// Load settings
async function loadSettings() {
    try {
        const apiUrl = await getApiUrl();
        const autoScan = await getSetting('autoScan');
        const notifications = await getSetting('notifications');

        apiUrlInput.value = apiUrl;
        autoScanCheckbox.checked = autoScan || false;
        notificationsCheckbox.checked = notifications || false;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Helper functions
async function getApiUrl() {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ apiUrl: DEFAULT_API_URL }, (result) => {
            resolve(result.apiUrl);
        });
    });
}

async function getSetting(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ [key]: false }, (result) => {
            resolve(result[key]);
        });
    });
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getRiskClass(level) {
    const normalized = String(level || '').toLowerCase();
    if (normalized.includes('critical') || normalized.includes('high')) return 'high';
    if (normalized.includes('medium')) return 'medium';
    if (normalized.includes('low') || normalized.includes('safe')) return 'low';
    return 'unknown';
}

function showLoading(visible) {
    if (visible) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    resultCard.innerHTML = `
        <div class="result-card high-risk">
            <p><span class="detail-label">Error:</span> ${escapeHtml(message)}</p>
        </div>
    `;
    results.classList.remove('hidden');
}

function showSuccess(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #52c41a;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 13px;
        z-index: 10000;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function showNotification(url, data) {
    try {
        if (!chrome.notifications) {
            console.warn('Notifications API not available');
            return;
        }
        
        const title = 'CheckShield URL Scan';
        const message = `${data.risk_level.toUpperCase()}: ${url.substring(0, 50)}...`;
        const iconUrl = chrome.runtime.getURL('icons/icon-48.svg');

        chrome.notifications.create({
            type: 'basic',
            iconUrl: iconUrl,
            title: title,
            message: message,
            priority: 2
        });
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}
