import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import { cn } from '../util/cn';

type StatusType = 'scanning' | 'safe' | 'danger' | null;

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'scanning':
        return {
          icon: Shield,
          color: "text-blue-400",
          bgColor: "bg-blue-400 bg-opacity-20",
          pulseColor: "rgba(59, 130, 246, 0.5)",
          label: "Scanning",
        };
      case 'safe':
        return {
          icon: Check,
          color: "text-emerald-400",
          bgColor: "bg-emerald-400 bg-opacity-20",
          pulseColor: "rgba(52, 211, 153, 0.5)",
          label: "Safe",
        };
      case 'danger':
        return {
          icon: AlertTriangle,
          color: "text-red-400",
          bgColor: "bg-red-400 bg-opacity-20",
          pulseColor: "rgba(248, 113, 113, 0.5)",
          label: "Danger",
        };
      default:
        return {
          icon: Shield,
          color: "text-gray-400",
          bgColor: "bg-gray-400 bg-opacity-20",
          pulseColor: "rgba(156, 163, 175, 0.5)",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!status) return null;

  return (
    <div className={cn("flex items-center", className)}>
      <motion.div 
        className={cn(
          "relative flex items-center justify-center rounded-full p-3",
          config.bgColor
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Icon className={cn("w-5 h-5", config.color)} />
        
        {status === 'scanning' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ 
              boxShadow: `0 0 0 0px ${config.pulseColor}`,
              background: "transparent"
            }}
            animate={{
              boxShadow: [
                `0 0 0 0px ${config.pulseColor}`,
                `0 0 0 8px rgba(59, 130, 246, 0)`,
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeOut"
            }}
          />
        )}
      </motion.div>
      <span className={cn("ml-2 font-medium", config.color)}>
        {config.label}
      </span>
    </div>
  );
};

export default StatusIndicator;