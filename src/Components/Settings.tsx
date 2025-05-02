import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Eye, Shield, Database, Users, Save, RotateCcw, LucideIcon } from 'lucide-react';
import GlassMorphism from './GlassMorphism';

// Define settings type for type safety
interface Settings {
  notifications: boolean;
  autoScan: boolean;
  advancedProtection: boolean;
  dataCollection: boolean;
  syncSettings: boolean;
}


// Define settings config type
interface SettingConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  key: keyof Settings;
}

// Default settings
const defaultSettings: Settings = {
  notifications: true,
  autoScan: true,
  advancedProtection: false,
  dataCollection: true,
  syncSettings: false,
};

// Toast component for notifications
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
  >
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
      ✕
    </button>
  </motion.div>
);

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      } transition-colors duration-200`}
      onClick={onChange}
    >
      <span className="sr-only">Toggle setting</span>
      <motion.span
        className="inline-block h-4 w-4 transform rounded-full bg-white"
        initial={false}
        animate={{ x: enabled ? 14 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

const Comp3: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load settings from localStorage or use defaults
    try {
      const saved = localStorage.getItem('quickPhishSettings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (error) {
      console.error('Failed to parse settings from localStorage:', error);
      return defaultSettings;
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    // Ensure settings are valid
    const isValidSettings = (obj: unknown): obj is Settings => {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        'notifications' in obj &&
        'autoScan' in obj &&
        'advancedProtection' in obj &&
        'dataCollection' in obj &&
        'syncSettings' in obj
      );
    };

    if (!isValidSettings(settings)) {
      setSettings(defaultSettings);
    }
  }, [settings]);

  const toggleSetting = (key: keyof Settings): void => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async (): Promise<void> => {
    setIsSaving(true);
    try {
      // Simulate async save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('quickPhishSettings', JSON.stringify(settings));
      setToast({ message: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setToast({ message: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const resetSettings = async (): Promise<void> => {
    setIsResetting(true);
    try {
      // Simulate async reset operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(defaultSettings);
      localStorage.setItem('quickPhishSettings', JSON.stringify(defaultSettings));
      setToast({ message: 'Settings reset to defaults!' });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      setToast({ message: 'Failed to reset settings' });
    } finally {
      setIsResetting(false);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const settingsConfig: SettingConfig[] = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Receive alerts when threats are detected',
      key: 'notifications',
    },
    {
      icon: Eye,
      title: 'Auto-Scan URLs',
      description: 'Automatically scan URLs when clicking links',
      key: 'autoScan',
    },
    {
      icon: Shield,
      title: 'Advanced Protection',
      description: 'Enable deeper scanning (may slow browsing)',
      key: 'advancedProtection',
    },
    {
      icon: Database,
      title: 'Anonymous Data Collection',
      description: 'Help improve detection by sharing anonymous data',
      key: 'dataCollection',
    },
    {
      icon: Users,
      title: 'Sync Settings',
      description: 'Sync settings across your devices',
      key: 'syncSettings',
    },
  ];

  return (
    <div className="w-full h-full p-8 flex flex-col overflow-auto bg-gray-100 text-gray-900">
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
          Settings
        </h1>
        <p className="text-gray-600 text-sm mt-2">Configure QuickPhish protection</p>
      </motion.div>

      <div className="space-y-6">
        {settingsConfig.map((setting, index) => (
          <motion.div
            key={setting.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <GlassMorphism variant="card" className="p-5 rounded-lg bg-white bg-opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-100 bg-opacity-80 mr-4 flex-shrink-0">
                    <setting.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-base font-medium text-gray-900">{setting.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
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
        className="mt-8 flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          onClick={resetSettings}
          disabled = {isResetting}
          className={`flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ${
            isResetting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw size={18} className="mr-2" />
          {isResetting ? 'Resetting...' : 'Reset to Defaults'}
        </button>
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        <GlassMorphism className="p-4 text-center text-xs text-gray-600 bg-white bg-opacity-80 rounded-lg">
          QuickPhish v1.0.0
          <br />
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>{' '}
          ·{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </a>
        </GlassMorphism>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Comp3;