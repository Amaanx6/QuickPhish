// Listen for tab creation events
chrome.tabs.onCreated.addListener((tab) => {
    // Open the extension popup when a new tab is created
    chrome.action.openPopup();
  });
  
  // Listen for tab activation events (when user switches tabs)
  chrome.tabs.onActivated.addListener((activeInfo) => {
    // When a user switches to any tab, open the popup
    chrome.action.openPopup();
  });
  
  // Listen for tab updates (when page content changes/loads)
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // For all tabs that complete loading
    if (changeInfo.status === 'complete') {
      // Check if this tab is the active tab in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id === tabId) {
          chrome.action.openPopup();
        }
      });
    }
  });