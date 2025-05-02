import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import GlassMorphism from './GlassMorphism';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatBotProps {
  isMalicious: boolean | null;
  currentUrl: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ isMalicious, currentUrl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Normalize URL to hostname for storage key
  const getStorageKey = () => {
    try {
      const url = new URL(currentUrl);
      return `chatHistory_${url.hostname.replace(/\./g, '_')}`;
    } catch {
      return 'chatHistory_default';
    }
  };

  // Scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history from storage for the current website
  useEffect(() => {
    const storageKey = getStorageKey();
    chrome.storage.local.get([storageKey], (result) => {
      const savedMessages = result[storageKey] || [];
      setMessages(savedMessages);
      scrollToBottom();
    });
  }, [currentUrl]);

  // Save chat history to storage for the current website
  const saveChatHistory = (updatedMessages: ChatMessage[]) => {
    const storageKey = getStorageKey();
    chrome.storage.local.set({ [storageKey]: updatedMessages });
  };

  // Handle initial malicious URL message
  useEffect(() => {
    if (isMalicious !== null && currentUrl) {
      const initialMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        content: isMalicious
          ? `The URL "${currentUrl}" appears to be malicious. It may contain phishing patterns such as embedded credentials, non-HTTPS protocols, suspicious TLDs, or matches known threats in Google's Safe Browsing database. Avoid sharing personal information on this site. Would you like more details about why this URL is risky?`
          : `The URL "${currentUrl}" is safe based on my analysis. No phishing or malware threats were detected. Do you have any questions about this site or phishing in general?`,
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prev) => {
        const updated = [initialMessage, ...prev];
        saveChatHistory(updated);
        return updated;
      });
      scrollToBottom();
    }
  }, [isMalicious, currentUrl]);

  // Call Gemini API
  const callGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!API_KEY) throw new Error('API key is not configured');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a cybersecurity assistant for the QuickPhish browser extension. Provide concise, accurate answers about phishing, URLs, and web safety. For the URL "${currentUrl}", which is ${isMalicious ? 'malicious' : 'safe'}, respond to: ${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('API error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => {
      const updated = [userMessage, ...prev];
      saveChatHistory(updated);
      return updated;
    });
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    const botResponse = await callGeminiAPI(input);
    const botMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'bot',
      content: botResponse,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => {
      const updated = [botMessage, ...prev];
      saveChatHistory(updated);
      return updated;
    });
    setIsLoading(false);
    scrollToBottom();
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col overflow-hidden">
      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          ChatBot
        </h1>
        <p className="text-gray-400 text-sm mt-1">Ask about anything, including phishing or the scanned URL</p>
      </motion.div>

      <GlassMorphism
        variant="card"
        className="flex-1 flex flex-col rounded-xl bg-white bg-opacity-10 backdrop-blur-md border border-blue-500 border-opacity-20"
      >
        <div className="flex-1 p-4 overflow-y-auto">
          <AnimatePresence>
            {messages.slice(0).reverse().map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                      : 'bg-white bg-opacity-10 backdrop-blur-md text-gray-100 border border-blue-500 border-opacity-20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-center mb-1">
                    {message.role === 'bot' && (
                      <>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                        </motion.div>
                        <span className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                          {message.timestamp}
                        </span>
                      </>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      message.role === 'user' ? 'text-white' : 'text-black break-words'
                    }`}
                  >
                    {message.content}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <GlassMorphism
          className="p-3 bg-white bg-opacity-10 backdrop-blur-md border-t border-blue-500 border-opacity-20"
        >
          <div className="flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about anything..."
              className="flex-1 p-3 bg-white bg-opacity-20 backdrop-blur-md text-black rounded-xl border border-blue-500 border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all resize-none placeholder:text-white placeholder:opacity-70"
              rows={2}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl ${
                isLoading || !input.trim()
                  ? 'bg-gray-600 bg-opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-600'
              }`}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </GlassMorphism>
      </GlassMorphism>
    </div>
  );
};

export default ChatBot;