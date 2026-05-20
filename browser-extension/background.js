// Background Service Worker for CheckShield Extension

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanUrl') {
        scanUrlBackground(request.url).then(sendResponse);
        return true; // Keep channel open for async response
    }
});

// Background URL scanning
async function scanUrlBackground(url) {
    try {
        const apiUrl = await getApiUrlFromStorage();
        const response = await fetch(`${apiUrl}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            return { error: `API error: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        return { error: error.message };
    }
}

// Get API URL from storage
function getApiUrlFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ apiUrl: 'http://localhost:8000' }, (result) => {
            resolve(result.apiUrl);
        });
    });
}

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
    // Set default values
    chrome.storage.sync.set({
        apiUrl: 'http://localhost:8000',
        autoScan: false,
        notifications: true
    });

    chrome.storage.local.set({
        scanHistory: []
    });

    console.log('CheckShield extension installed');
});

// Handle tab updates for potential auto-scanning
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const autoScan = await getSetting('autoScan');
    if (autoScan) {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab && tab.url && !tab.url.startsWith('chrome://')) {
                // Auto-scan the page on activation
            }
        });
    }
});

// Helper function
function getSetting(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ [key]: false }, (result) => {
            resolve(result[key]);
        });
    });
}
