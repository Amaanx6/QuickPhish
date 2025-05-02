// Store pending navigations using Chrome's storage API
function setPendingUrl(tabId, url) {
  return chrome.storage.local.set({ [`pending_${tabId}`]: url });
}

function getPendingUrl(tabId) {
  return new Promise((resolve) => {
      chrome.storage.local.get([`pending_${tabId}`], (result) => {
          resolve(result[`pending_${tabId}`]);
      });
  });
}

function removePendingUrl(tabId) {
  return chrome.storage.local.remove([`pending_${tabId}`]);
}

// Track pages we've already processed
const processedUrls = new Set();

// Listen for webNavigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only process main frame navigations (not iframes)
  if (details.frameId !== 0) return;
  
  // Skip chrome:// and extension URLs
  if (details.url.startsWith('chrome://') || 
      details.url.startsWith('chrome-extension://') || 
      details.url === 'about:blank') {
      return;
  }
  
  // Check if we've already processed this navigation
  const navigationKey = `${details.tabId}-${details.url}`;
  if (processedUrls.has(navigationKey)) return;
  
  // Mark as processed
  processedUrls.add(navigationKey);
  setTimeout(() => processedUrls.delete(navigationKey), 30000); // Clean up after 30 seconds
  
  // Store URL for approval
  await setPendingUrl(details.tabId, details.url);
  
  // Open the extension popup
  chrome.action.openPopup();
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PENDING_URL") {
      const tabId = sender.tab ? sender.tab.id : message.tabId;
      
      getPendingUrl(tabId).then(pendingUrl => {
          sendResponse({ url: pendingUrl || "No pending navigation" });
      });
      
      return true; // Keep the message channel open for async response
  }
  
  if (message.type === "APPROVE_URL") {
      const tabId = sender.tab ? sender.tab.id : message.tabId;
      
      getPendingUrl(tabId).then(pendingUrl => {
          if (pendingUrl) {
              // Navigate the tab to the approved URL
              chrome.tabs.update(tabId, { url: pendingUrl });
              // Remove from pending storage
              removePendingUrl(tabId);
              sendResponse({ success: true });
          } else {
              sendResponse({ success: false, message: "No pending navigation found" });
          }
      });
      
      return true; // Keep the message channel open for async response
  }
  
  if (message.type === "BLOCK_URL") {
      const tabId = sender.tab ? sender.tab.id : message.tabId;
      
      // Remove from pending list
      removePendingUrl(tabId).then(() => {
          // Navigate to a safe page
          chrome.tabs.update(tabId, { url: "https://www.google.com" });
          sendResponse({ success: true });
      });
      
      return true; // Keep the message channel open for async response
  }
});