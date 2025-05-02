import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Calendar, ArrowUpRight } from 'lucide-react';
import GlassMorphism from './GlassMorphism';

interface ScanResult {
  url: string;
  date: string;
  safe: boolean;
}

const Comp1 = () => {
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [protectedCount, setProtectedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);

  useEffect(() => {
    // Retrieve scan history and counters from local storage
    chrome.storage.local.get(['scanHistory', 'protectedCount', 'blockedCount'], (result) => {
      setRecentScans(result.scanHistory || []);
      setProtectedCount(result.protectedCount || 0);
      setBlockedCount(result.blockedCount || 0);
    });
  }, []);

  return (
    <div className="w-full h-full p-6 flex flex-col overflow-auto">
      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          History
        </h1>
        <p className="text-gray-400 text-sm mt-1">Your recent scan history</p>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <GlassMorphism variant="card" className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-500 bg-opacity-20 mr-3">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Protected</h3>
              <p className="text-xl font-bold text-white">{protectedCount}</p>
            </div>
          </div>
        </GlassMorphism>
        
        <GlassMorphism variant="card" className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-500 bg-opacity-20 mr-3"> 
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Blocked</h3>
              <p className="text-xl font-bold text-white">{blockedCount}</p>
            </div>
          </div>
        </GlassMorphism>
      </div>

      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="w-4 h-4 mr-2 text-blue-400" />
        Recent Scans
      </h2>

      <div className="space-y-3">
        {recentScans.length === 0 ? (
          <GlassMorphism variant="card" className="p-4 text-center">
            <p className="text-sm text-gray-400">No scans yet.</p>
          </GlassMorphism>
        ) : (
          recentScans.map((scan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <GlassMorphism variant="card" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <div className={`w-2 h-2 rounded-full ${scan.safe ? 'bg-green-400' : 'bg-red-400'} mr-2`}></div>
                      <h3 className="text-sm font-medium truncate">{scan.url}</h3>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {scan.date}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              </GlassMorphism>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comp1;