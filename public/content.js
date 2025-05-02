// This script runs directly in web pages
(function() {
    // Check if we're in a frame or top level document
    if (window !== window.top) {
      return; // Skip iframes
    }
    
    // Don't run on about:blank pages
    if (window.location.href === 'about:blank') {
      return;
    }
    
    // Initial page load detection
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkNavigation);
    } else {
      checkNavigation();
    }
    
    function checkNavigation() {
      // Get current URL
      const currentUrl = window.location.href;
      
      // Skip extension pages and about:blank
      if (currentUrl.startsWith('chrome://') || 
          currentUrl.startsWith('chrome-extension://') ||
          currentUrl === 'about:blank') {
        return;
      }
      
      // Check if we need approval for this URL
      chrome.runtime.sendMessage({ 
        type: "GET_PENDING_URL"
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error in message:", chrome.runtime.lastError);
          return;
        }
        
        if (response && response.url && response.url === currentUrl) {
          // We'll let the popup handle this - no overlay from content script
          console.log("URL needs approval, should show popup");
        }
      });
    }
  })();