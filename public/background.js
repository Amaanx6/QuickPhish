// Listen for tab creation events
chrome.tabs.onCreated.addListener((tab) => {
    // Skip opening popup for blank or default new tabs
    if (tab.url === 'chrome://newtab/' || tab.url === 'about:blank') {
      return;
    }
    
    // For all other new tabs, immediately show our approval popup
    chrome.action.openPopup();
  });
  
  // Listen for navigation events in tabs
  chrome.webNavigation && chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // Skip our own extension pages and Chrome internal pages
    if (details.url.startsWith('chrome://') || 
        details.url === 'about:blank' ||
        details.url.startsWith('chrome-extension://')) {
      return;
    }
    
    // Only interrupt navigation on the main frame, not iframes or other sub-resources
    if (details.frameId === 0) {
      // This is the main frame navigation, pause it and show our popup
      chrome.tabs.get(details.tabId, (tab) => {
        // Don't interrupt the new tab page
        if (tab.url !== 'chrome://newtab/' && tab.url !== 'about:blank') {
          // We'll temporarily redirect to about:blank to pause the navigation
          chrome.tabs.update(details.tabId, { url: 'about:blank' });
          
          // Then open our popup to ask for confirmation
          chrome.action.openPopup();
        }
      });
    }
  });