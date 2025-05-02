import React, { ReactNode } from 'react';
import { cn } from '../util/cn'; // Update with the correct path to the utility function

interface GlassProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'button' | 'sidebar';
}

const GlassMorphism: React.FC<GlassProps> = ({ 
  children, 
  className, 
  variant = 'default' 
}) => {
  const baseClasses = "relative overflow-hidden rounded-xl";
  
  const variantClasses = {
    default: "glass-panel",
    card: "glass-card",
    button: "glass-button",
    sidebar: "glass-sidebar"
  };
  
  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {/* Glass shine effect at the top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white bg-opacity-20"></div>
      {children}
    </div>
  );
};

export default GlassMorphism;