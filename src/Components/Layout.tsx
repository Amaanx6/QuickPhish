import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { CheckUrlMain } from './CheckUrlMain';
import Comp3 from './Settings';
import Comp2 from './Learn';
import Comp1 from './History';

type ActivePanel = 'main' | 'comp1' | 'comp2' | 'comp3';

const Layout: React.FC = () => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('main');
  
  const renderActivePanel = () => {
    switch (activePanel) {
      case 'main':
        return <CheckUrlMain />;
      case 'comp1':
        return <Comp1 />;
      case 'comp2':
        return <Comp2 />;
      case 'comp3':
        return <Comp3 />;
      default:
        return <CheckUrlMain />;
    }
  };

  return (
    <div className="flex h-[600px] w-[400px] overflow-hidden app-background text-white">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      <motion.main 
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderActivePanel()}
      </motion.main>
    </div>
  );
};

export default Layout;