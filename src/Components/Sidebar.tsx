import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, BookOpen, Settings} from 'lucide-react';
import { NavItem } from './types';
import GlassMorphism from './GlassMorphism';

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: 'main' | 'comp1' | 'comp2' | 'comp3') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePanel, setActivePanel }) => {
  const navItems: NavItem[] = [
    { name: 'Protect', icon: 'shield', id: 'main' },
    { name: 'History', icon: 'clock', id: 'comp1' },
    { name: 'Learn', icon: 'book', id: 'comp2' },
    { name: 'Settings', icon: 'settings', id: 'comp3' },
  ];

  const getIcon = (iconName: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-300'}`;
    
    switch (iconName) {
      case 'shield':
        return <Shield className={className} />;
      case 'clock':
        return <Clock className={className} />;
      case 'book':
        return <BookOpen className={className} />;
      case 'settings':
        return <Settings className={className} />;
      default:
        return <Shield className={className} />;
    }
  };

  return (
    <GlassMorphism 
      variant="sidebar"
      className="w-20 flex flex-col items-center py-6 z-10"
    >
      <motion.div 
        className="mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="w-12 h-12 relative flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-sm opacity-70"></div>
          <Shield className="w-6 h-6 text-white relative z-10" />
        </motion.div>
      </motion.div>
      
      <nav className="flex-1 w-full">
        <ul className="space-y-6">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <motion.button
                className={`w-full flex flex-col items-center py-2 px-1 group relative`}
                onClick={() => setActivePanel(item.id as 'main' | 'comp1' | 'comp2' | 'comp3')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activePanel === item.id && (
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-md"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                  activePanel === item.id 
                    ? 'bg-white bg-opacity-10' 
                    : 'hover:bg-white hover:bg-opacity-5'
                }`}>
                  {getIcon(item.icon, activePanel === item.id)}
                  
                  {item.id === 'main' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white border-opacity-30"></div>
                  )}
                </div>
                
                <span className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                  activePanel === item.id 
                    ? 'text-blue-400' 
                    : 'text-gray-400 group-hover:text-blue-300'
                }`}>
                  {item.name}
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </nav>
      
      <motion.div 
        className="mt-auto pt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        
      </motion.div>
    </GlassMorphism>
  );
};

export default Sidebar;