import { motion } from 'framer-motion';
import { BookOpen, Link, ShieldAlert, LockKeyhole, AlertTriangle } from 'lucide-react';
import GlassMorphism from './GlassMorphism';

const Comp2 = () => {
  const phishingTips = [
    {
      icon: Link,
      title: "Check the URL",
      description: "Verify the website address before entering any information. Look for misspellings or unusual domains."
    },
    {
      icon: ShieldAlert,
      title: "Be wary of urgent requests",
      description: "Legitimate organizations don't create urgency to bypass your critical thinking."
    },
    {
      icon: LockKeyhole,
      title: "Look for HTTPS",
      description: "Secure websites use encryption. Check for the padlock icon in your browser."
    },
    {
      icon: AlertTriangle,
      title: "Don't trust attachments",
      description: "Be cautious with email attachments, even if they appear to come from known senders."
    }
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
          Learn
        </h1>
        <p className="text-gray-400 text-sm mt-1">How to identify phishing attempts</p>
      </motion.div>

      <GlassMorphism className="p-5 mb-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-blue-500 bg-opacity-20 mr-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold">Phishing Protection Tips</h2>
        </div>
        
        <p className="text-sm text-gray-300 mb-2">
          Phishing attacks are increasingly sophisticated. Learn how to protect yourself with these essential tips.
        </p>
      </GlassMorphism>

      <div className="space-y-4">
        {phishingTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <GlassMorphism variant="card" className="p-4">
              <div className="flex">
                <div className="p-2 rounded-full bg-white bg-opacity-10 mr-3 flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{tip.title}</h3>
                  <p className="text-xs text-gray-400">{tip.description}</p>
                </div>
              </div>
            </GlassMorphism>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-auto pt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <a 
          href="#" 
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center"
        >
          Learn more about online security
          <ArrowIcon className="ml-1 w-3 h-3" />
        </a>
      </motion.div>
    </div>
  );
};

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={className}
  >
    <path 
      fillRule="evenodd" 
      d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" 
      clipRule="evenodd" 
    />
  </svg>
);

export default Comp2;