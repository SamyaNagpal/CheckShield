// Content Script - Runs on all web pages

// Inject URL detection into page context
injectUrlDetection();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCurrentUrl') {
        sendResponse({ url: window.location.href });
    }
});

// Inject detection script
function injectUrlDetection() {
    try {
        // Add right-click context menu support
        document.addEventListener('contextmenu', (event) => {
            const url = event.target.href || event.target.src;
            if (url && !url.startsWith('chrome://')) {
                // Store the URL for context menu handling if needed
                chrome.runtime.sendMessage({
                    action: 'contextMenuUrl',
                    url: url
                }).catch(err => {
                    // Extension context may not be available
                });
            }
        });

        // Highlight suspicious links (optional feature)
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (link.href && !link.href.startsWith('http')) {
                // Relative links are generally safe
                return;
            }
        });
    } catch (error) {
        console.log('CheckShield content script loaded');
    }
}

// Monitor for dynamic content changes
const observer = new MutationObserver((mutations) => {
    // This could be used to scan dynamically added links
    // For now, we keep it minimal to avoid performance issues
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Clean up
window.addEventListener('beforeunload', () => {
    observer.disconnect();
});
