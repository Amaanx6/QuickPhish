import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import GlassMorphism from './GlassMorphism';
import StatusIndicator from './StatusIndicator';

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

export function CheckUrlMain({ activePanel }: { activePanel: string }) {
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
      if (isMalicious === false && tabId && activePanel === 'main') {
        handleApprove();
        setShowSafeNotification(true);
        setTimeout(() => {
          setShowSafeNotification(false);
          if (activePanel === 'main') {
            window.close();
          }
        }, 3000); // Close after 3 seconds
      }
    }, 700); // 2 seconds for scanning

    // Cleanup timer on component unmount
    return () => clearTimeout(scanningTimer);
  }, [isMalicious, tabId, activePanel]);

  const handleApprove = () => {
    if (tabId) {
      chrome.runtime.sendMessage(
        { type: "APPROVE_URL", tabId },
        (response) => {
          if (response?.success && isMalicious && activePanel === 'main') {
            window.close(); // Close popup only after user approval for malicious
          }
        }
      );
    }
  };

  const handleBlock = () => {
    if (tabId) {
      chrome.runtime.sendMessage(
        { type: "BLOCK_URL", tabId },
        () => {
          if (activePanel === 'main') {
            window.close(); // Close popup after blocking
          }
        }
      );
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col overflow-auto">
      <motion.div 
        className="mb-6 flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          QuickPhish
        </h1>
        
        {(isScanning || isMalicious !== null) && (
          <StatusIndicator 
            status={isScanning ? 'scanning' : isMalicious ? 'danger' : 'safe'} 
          />
        )}
      </motion.div>
      
      {isScanning || isMalicious === null ? (
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div 
            className="relative w-20 h-20 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500"></div>
          </motion.div>
          
          <GlassMorphism variant="card" className="p-4 max-w-xs text-center">
            <p className="text-base font-medium">Scanning for threats...</p>
            <p className="text-sm text-gray-300 mt-1">Analyzing URL patterns and checking security databases</p>
          </GlassMorphism>
        </motion.div>
      ) : showSafeNotification ? (
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            <div className="w-24 h-24 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>
          
          <GlassMorphism variant="card" className="p-6 max-w-xs text-center">
            <h2 className="text-lg font-semibold mb-2 text-green-400">
              This website is safe
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              No security threats have been detected on this site.
            </p>
            <div className="p-3 rounded-md bg-white bg-opacity-5 border border-green-400 border-opacity-20 mt-2 break-all">
              <code className="text-xs text-gray-300">{currentUrl}</code>
            </div>
          </GlassMorphism>
        </motion.div>
      ) : isMalicious ? (
        <motion.div 
          className="flex-1 flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <GlassMorphism variant="card" className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-4 p-2 rounded-full bg-red-500 bg-opacity-20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-red-400">
                Phishing Threat Detected
              </h2>
            </div>
            
            <div className="p-3 rounded-md bg-white bg-opacity-5 border border-white border-opacity-10 break-all mb-4">
              <div className="flex items-center mb-1">
                <ExternalLink className="w-4 h-4 text-red-300 mr-2" />
                <span className="text-xs text-red-300">URL</span>
              </div>
              <code className="text-sm text-red-400">{currentUrl}</code>
            </div>

            <GlassMorphism className="p-4 bg-red-900 bg-opacity-20 border-red-500 border-opacity-30 mb-6">
              <p className="text-sm text-red-200">
                This link matches known phishing patterns or suspicious characteristics. 
                Proceeding may risk your personal information and security.
              </p>
            </GlassMorphism>

            <div className="flex justify-end space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBlock}
                className="glass-button px-5 py-2.5 rounded-lg bg-gradient-to-br from-red-600 to-red-800 text-white font-medium text-sm hover:shadow-lg"
              >
                Block & Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApprove}
                className="glass-button px-5 py-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white font-medium text-sm hover:shadow-lg"
              >
                Proceed Anyway
              </motion.button>
            </div>
          </GlassMorphism>
          
          <GlassMorphism className="p-4 text-center">
            <p className="text-xs text-gray-400">
              QuickPhish has prevented <span className="font-semibold text-blue-400">231</span> phishing attacks this month
            </p>
          </GlassMorphism>
        </motion.div>
      ) : null}
    </div>
  );
}