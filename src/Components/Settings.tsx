import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Eye, Shield, Moon, Users, Database } from 'lucide-react';
import GlassMorphism from './GlassMorphism';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        enabled ? 'bg-blue-500' : 'bg-gray-700'
      }`}
      onClick={onChange}
    >
      <span className="sr-only">Toggle setting</span>
      <motion.span
        className="inline-block h-4 w-4 transform rounded-full bg-white"
        initial={false}
        animate={{ 
          x: enabled ? 14 : 3,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

const Comp3 = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoScan: true,
    advancedProtection: false,
    dataCollection: true,
    syncSettings: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsConfig = [
    {
      icon: Bell,
      title: "Notifications",
      description: "Receive alerts when threats are detected",
      key: "notifications" as const,
    },
    {
      icon: Moon,
      title: "Dark Mode",
      description: "Use dark theme for the extension",
      key: "darkMode" as const,
    },
    {
      icon: Eye,
      title: "Auto-Scan URLs",
      description: "Automatically scan URLs when clicking links",
      key: "autoScan" as const,
    },
    {
      icon: Shield,
      title: "Advanced Protection",
      description: "Enable deeper scanning (may slow browsing)",
      key: "advancedProtection" as const,
    },
    {
      icon: Database,
      title: "Anonymous Data Collection",
      description: "Help improve detection by sharing anonymous data",
      key: "dataCollection" as const,
    },
    {
      icon: Users,
      title: "Sync Settings",
      description: "Sync settings across your devices",
      key: "syncSettings" as const,
    },
  ];

  return (
    <div className="w-full h-full p-6 flex flex-col overflow-auto">
      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Configure QuickPhish protection</p>
      </motion.div>

      <div className="space-y-4">
        {settingsConfig.map((setting, index) => (
          <motion.div
            key={setting.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <GlassMorphism variant="card" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-white bg-opacity-10 mr-3 flex-shrink-0">
                    <setting.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-sm font-medium">{setting.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
                  </div>
                </div>
                <Toggle 
                  enabled={settings[setting.key]} 
                  onChange={() => toggleSetting(setting.key)} 
                />
              </div>
            </GlassMorphism>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <GlassMorphism className="p-4 text-center text-xs text-gray-400">
          QuickPhish v1.0.0
          <br />
          <span className="text-blue-400">Privacy Policy</span> · <span className="text-blue-400">Terms of Service</span>
        </GlassMorphism>
      </motion.div>
    </div>
  );
};

export default Comp3;