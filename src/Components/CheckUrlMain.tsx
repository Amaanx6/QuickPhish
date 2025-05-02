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
  const [isLoading, setIsLoading] = useState(true);
  const [tabId, setTabId] = useState<number | null>(null);
  const [isMalicious, setIsMalicious] = useState(false);

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
                setIsLoading(false);
                return;
              }

              if (response?.url) {
                setCurrentUrl(response.url);
                const maliciousStatus = await checkPhishing(response.url);
                setIsMalicious(maliciousStatus);
              }
              setIsLoading(false);
            }
          );
        }
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    fetchUrlAndCheck();

    // const timer = setTimeout(() => {
    //   if (!currentUrl) window.close();
    // }, 10000);

    // return () => clearTimeout(timer);
  }, []);

  const handleApprove = () => {
    if (tabId) {
      chrome.runtime.sendMessage(
        { type: "APPROVE_URL", tabId },
        (response) => {
          if (response?.success) window.close();
        }
      );
    }
  };

  const handleBlock = () => {
    if (tabId) {
      chrome.runtime.sendMessage(
        { type: "BLOCK_URL", tabId },
        () => window.close()
      );
    }
  };

  return (
    <div className="min-w-[400px] p-4 bg-gray-100 min-h-[200px]">
      <h1 className="text-xl font-bold mb-4">QuickPhish Protection</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="text-gray-600 text-sm">Analyzing link safety...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className={`text-lg font-semibold mb-2 ${
              isMalicious ? 'text-red-600' : 'text-gray-800'
            }`}>
              {isMalicious ? '⚠️ Dangerous Link Detected' : 'Safe Navigation Approval'}
            </h2>
            <div className="p-3 bg-white rounded-md break-all border border-gray-300">
              <code className={`text-sm ${isMalicious ? 'text-red-600' : 'text-gray-700'}`}>
                {currentUrl}
              </code>
            </div>
          </div>

          {isMalicious && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-sm text-red-700">
                This link matches known phishing patterns or suspicious characteristics. 
                Proceeding may risk your security.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleBlock}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              {isMalicious ? 'Block & Report' : 'Cancel Navigation'}
            </button>
            <button
              onClick={handleApprove}
              className={`${
                isMalicious 
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-2 rounded-md transition-colors`}
            >
              {isMalicious ? 'Proceed Anyway' : 'Approve Navigation'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}