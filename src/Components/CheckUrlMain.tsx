import { useEffect, useState } from 'react';

// Phishing detection service
const checkPhishing = async (url: string): Promise<boolean> => {
  // Local heuristic checks
  const suspiciousPatterns = [
    /@/, // Embedded credentials
    /^http:\/\//, // Non-HTTPS
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address
    /\.(ru|cn|top|xyz)\//i, // Suspicious TLDs
    /[^\w]login\.php\?redirect=/i // Common phishing paths
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(url))) {
    return true;
  }

  // Check cache
  const cacheKey = `phish_${btoa(url)}`;
  const cachedResult = await chrome.storage.local.get(cacheKey);
  if (cachedResult[cacheKey]?.expires > Date.now()) {
    return cachedResult[cacheKey].isMalicious;
  }

  // API Check with Safe Browsing
  try {
    const API_KEY = import.meta.env.VITE_SAFEBROWSING_KEY;
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: {
            clientId: "QuickPhish",
            clientVersion: "1.0"
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
          }
        })
      }
    );

    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    const isMalicious = data.matches?.length > 0;

    // Cache result for 1 hour
    await chrome.storage.local.set({
      [cacheKey]: {
        isMalicious,
        expires: Date.now() + 3600000 // 1 hour
      }
    });

    return isMalicious;
  } catch (error) {
    console.error('Phishing check failed:', error);
    return false;
  }
};

export function CheckUrlMain() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [tabId, setTabId] = useState<number | null>(null);
  const [isMalicious, setIsMalicious] = useState<boolean | null>(null);
  const [showSafeNotification, setShowSafeNotification] = useState(false);

  useEffect(() => {
    const fetchUrlAndCheck = async () => {
      try {
        const [tab] = await chrome.tabs.query({ 
          active: true, 
          currentWindow: true 
        });

        if (tab?.id) {
          setTabId(tab.id);
          
          chrome.runtime.sendMessage(
            { type: "GET_PENDING_URL", tabId: tab.id },
            async (response) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
              }

              if (response?.url) {
                setCurrentUrl(response.url);
                const maliciousStatus = await checkPhishing(response.url);
                setIsMalicious(maliciousStatus);
              }
            }
          );
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUrlAndCheck();

    // Set a 2-second timer for scanning
    const scanningTimer = setTimeout(() => {
      setIsScanning(false);
      // If not malicious, approve and show safe notification
      if (isMalicious === false && tabId) {
        handleApprove();
        setShowSafeNotification(true);
        setTimeout(() => {
          setShowSafeNotification(false);
          window.close();
        }, 3000); // Close after 3 seconds
      }
    }, 2000); // 2 seconds for scanning

    // Cleanup timer on component unmount
    return () => clearTimeout(scanningTimer);
  }, [isMalicious, tabId]);

  const handleApprove = () => {
    if (tabId) {
      chrome.runtime.sendMessage(
        { type: "APPROVE_URL", tabId },
        (response) => {
          if (response?.success) {
            if (isMalicious) {
              window.close(); // Close popup only after user approval for malicious
            }
          }
        }
      );
    }
  };

  const handleBlock = () => {
    if (tabId) {
      chrome.runtime.sendMessage(
        { type: "BLOCK_URL", tabId },
        () => window.close() // Close popup after blocking
      );
    }
  };

  return (
    <div className="min-w-[400px] p-4 bg-gray-100 min-h-[200px]">
      <h1 className="text-xl font-bold mb-4">QuickPhish Protection</h1>
      
      {isScanning || isMalicious === null ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="text-gray-600 text-sm">Scanning website...</p>
        </div>
      ) : showSafeNotification ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-sm text-green-700">
            This website is safe to visit.
          </p>
          <div className="p-3 bg-white rounded-md break-all border border-gray-300 mt-2">
            <code className="text-sm text-gray-700">{currentUrl}</code>
          </div>
        </div>
      ) : isMalicious ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              ⚠️ Dangerous Link Detected
            </h2>
            <div className="p-3 bg-white rounded-md break-all border border-gray-300">
              <code className="text-sm text-red-600">{currentUrl}</code>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">
              This link matches known phishing patterns or suspicious characteristics. 
              Proceeding may risk your security.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleBlock}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Block & Report
            </button>
            <button
              onClick={handleApprove}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Proceed Anyway
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}