import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Link, ShieldAlert, LockKeyhole, AlertTriangle, Share2, Key, Globe, Mail, Smartphone, UserCheck, LucideIcon } from 'lucide-react';
import GlassMorphism from './GlassMorphism';

interface PhishingTip {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
  learnMoreLink?: string;
}

const Comp2: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewedTips, setViewedTips] = useState<Set<number>>(new Set());

  const phishingTips: PhishingTip[] = [
    {
      icon: Link,
      title: "Check the URL",
      description: "Verify the website address before entering any information. Look for misspellings or unusual domains.",
      details: "Always hover over links to see the actual URL. Legitimate websites typically use consistent domain names and avoid random characters or numbers.",
      learnMoreLink: "https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams"
    },
    {
      icon: ShieldAlert,
      title: "Be wary of urgent requests",
      description: "Legitimate organizations don't create urgency to bypass your critical thinking.",
      details: "Scammers often use time-sensitive language like 'Act now!' or 'Your account will be closed!' to pressure you into making quick decisions.",
      learnMoreLink: "https://www.usa.gov/online-safety"
    },
    {
      icon: LockKeyhole,
      title: "Look for HTTPS",
      description: "Secure websites use encryption. Check for the padlock icon in your browser.",
      details: "HTTPS indicates a secure connection, but it's not foolproof. Always verify the domain name matches the expected website.",
      learnMoreLink: "https://www.howtogeek.com/443086/what-is-https-and-why-should-i-care/"
    },
    {
      icon: AlertTriangle,
      title: "Don't trust attachments",
      description: "Be cautious with email attachments, even if they appear to come from known senders.",
      details: "Malicious attachments can contain malware. Always scan files with antivirus software and verify the sender's identity before opening.",
      learnMoreLink: "https://www.cisa.gov/secure-our-world/stop-ransomware"
    },
    {
      icon: Key,
      title: "Use strong passwords",
      description: "Create complex passwords to protect your accounts from unauthorized access.",
      details: "A strong password is at least 12 characters long, includes a mix of letters, numbers, and symbols, and avoids common words or personal information.",
      learnMoreLink: "https://www.nist.gov/identity-access-management/how-create-strong-password"
    },
    {
      icon: Globe,
      title: "Use a VPN on public Wi-Fi",
      description: "Protect your data on unsecured networks with a virtual private network.",
      details: "A VPN encrypts your internet traffic, preventing attackers from intercepting sensitive information like passwords or credit card details on public Wi-Fi.",
      learnMoreLink: "https://www.cisa.gov/secure-our-world/use-vpn"
    },
    {
      icon: Mail,
      title: "Verify email senders",
      description: "Check the sender’s email address, not just the display name, to avoid spoofing.",
      details: "Scammers can fake display names (e.g., 'Bank of America'). Always inspect the full email address and be cautious of slight misspellings or unusual domains.",
      learnMoreLink: "https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams"
    },
    {
      icon: Smartphone,
      title: "Enable two-factor authentication",
      description: "Add an extra layer of security to your accounts with 2FA.",
      details: "Two-factor authentication requires a second form of verification, like a code sent to your phone, making it harder for attackers to access your accounts.",
      learnMoreLink: "https://www.cisa.gov/secure-our-world/two-factor-authentication"
    },
    {
      icon: UserCheck,
      title: "Beware of social engineering",
      description: "Don’t share personal information with unsolicited contacts claiming authority.",
      details: "Social engineering tactics, like pretending to be a coworker or IT support, trick you into revealing sensitive data. Always verify the requester’s identity.",
      learnMoreLink: "https://www.sans.org/security-awareness-training/resources/social-engineering"
    },
    {
      icon: ShieldAlert,
      title: "Keep software updated",
      description: "Regularly update your devices to patch security vulnerabilities.",
      details: "Outdated software can be exploited by attackers. Enable automatic updates for your operating system, browser, and apps to stay protected.",
      learnMoreLink: "https://www.cisa.gov/secure-our-world/update-software"
    }
  ];

  const handleExpand = (index: number): void => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setViewedTips(prev => new Set(prev).add(index));
  };

  const handleShare = (tip: PhishingTip, e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: `${tip.description}\n\n${tip.details}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              Learn
            </h1>
            <p className="text-sm mt-2 text-gray-600">
              Master the art of identifying phishing attempts
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6">
        <GlassMorphism className="p-6 mb-6 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-200 mr-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Phishing Protection Tips
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Stay one step ahead of cybercriminals with these essential security tips.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(viewedTips.size / phishingTips.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs mt-2 text-gray-600">
            {viewedTips.size} of {phishingTips.length} tips viewed
          </p>
        </GlassMorphism>

        <div className="space-y-4 pb-6">
          {phishingTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              layout
            >
              <GlassMorphism
                variant="card"
                className={`p-5 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  expandedIndex === index ? 'mb-4' : ''
                }`}
                onClick={() => handleExpand(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1 min-w-0">
                    <div className="p-3 rounded-full bg-gray-200 mr-4">
                      <tip.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tip.description}
                      </p>
                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-sm mt-3 text-gray-700">
                              {tip.details}
                            </p>
                            {tip.learnMoreLink && (
                              <a
                                href={tip.learnMoreLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium mt-2 inline-block text-blue-600 hover:text-blue-500"
                                onClick={e => e.stopPropagation()}
                              >
                                Learn more →
                              </a>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleShare(tip, e)}
                    className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0"
                  >
                    <Share2 size={18} className="text-gray-600" />
                  </button>
                </div>
              </GlassMorphism>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-2">
        <motion.div
          className="pt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <a
            href="https://www.cisa.gov/stopransomware/phishing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center transition-colors duration-200"
          >
            Explore more cybersecurity resources
            <ArrowIcon className="ml-2 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

interface ArrowIconProps {
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ className }) => (
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