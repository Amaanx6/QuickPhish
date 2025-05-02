import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, BookOpen, Settings } from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: 'main' | 'comp1' | 'comp2' | 'comp3') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePanel, setActivePanel }) => {
  const navItems: NavItem[] = [
    { name: 'main', icon: 'shield', id: 'main' },
    { name: 'comp1', icon: 'clock', id: 'comp1' },
    { name: 'comp2', icon: 'book', id: 'comp2' },
    { name: 'comp3', icon: 'settings', id: 'comp3' },
  ];

  const getIcon = (iconName: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-400'}`;
    
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
    <motion.div 
      className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <motion.div 
          className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Shield className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      
      <nav className="flex-1 w-full">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.button
                className={`w-full flex flex-col items-center py-2 px-1 group ${
                  activePanel === item.id 
                    ? 'text-blue-500' 
                    : 'text-gray-500 hover:text-blue-400'
                }`}
                onClick={() => setActivePanel(item.id as 'main' | 'comp1' | 'comp2' | 'comp3')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getIcon(item.icon, activePanel === item.id)}
                <span className="text-xs mt-1 font-medium">{item.name}</span>
                {activePanel === item.id && (
                  <motion.div 
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-md"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;