import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Instagram, Twitter, Facebook, Linkedin, Youtube, CheckCircle, X, Loader2, Settings, Users, TrendingUp, ExternalLink } from 'lucide-react';

// Mock API functions (replace with actual API calls)
const fetchConnectedAccounts = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: 1,
      platform: 'Instagram',
      username: '@postwiseai',
      followers: 125000,
      connected: true,
      icon: Instagram,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 2,
      platform: 'Twitter',
      username: '@postwise_ai',
      followers: 68000,
      connected: true,
      icon: Twitter,
      color: 'from-sky-400 to-blue-500'
    }
  ];
};

const connectAccount = async (platform) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    success: true,
    message: `${platform} account connected successfully!`
  };
};

const disconnectAccount = async (accountId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    message: 'Account disconnected successfully!'
  };
};

// Available platforms
const availablePlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-purple-500',
    description: 'Connect your Instagram business account'
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    icon: Twitter,
    color: 'from-sky-400 to-blue-500',
    description: 'Link your Twitter profile'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-700',
    description: 'Connect your LinkedIn profile or page'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-500 to-sky-600',
    description: 'Link your Facebook page'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'from-red-500 to-red-600',
    description: 'Connect your YouTube channel'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: TrendingUp,
    color: 'from-pink-400 to-rose-500',
    description: 'Link your TikTok account'
  }
];

// Connect Card Component
const ConnectCard = ({ platform, isConnected, onConnect, connecting }) => {
  const Icon = platform.icon;
  
  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      {/* Status indicator */}
      {isConnected && (
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <div className="bg-emerald-500 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}

      {/* Platform icon */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Platform info */}
      <h3 className="text-xl font-bold text-slate-800 mb-2">{platform.name}</h3>
      <p className="text-sm text-slate-600 mb-4">{platform.description}</p>

      {/* Connect button */}
      {isConnected ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-3">
            <CheckCircle className="w-4 h-4" />
            Connected
          </div>
          <button className="w-full py-2.5 px-4 bg-white border-2 border-sky-200 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-50 transition-all duration-300 flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Manage Account
          </button>
        </div>
      ) : (
        <motion.button
          onClick={() => onConnect(platform)}
          disabled={connecting}
          className={`w-full py-2.5 px-4 bg-gradient-to-r ${platform.color} text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          whileHover={!connecting ? { scale: 1.05 } : {}}
          whileTap={!connecting ? { scale: 0.95 } : {}}
        >
          {connecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              Connect
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

// Connected Account Card Component
const ConnectedAccountCard = ({ account, onDisconnect, disconnecting }) => {
  const Icon = account.icon;
  
  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-5 border border-sky-200 shadow-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${account.color} shadow-md flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{account.platform}</h3>
              <p className="text-slate-600 font-medium">{account.username}</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
              <CheckCircle className="w-3 h-3" />
              Active
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4 text-sky-500" />
              <span className="text-sm font-semibold">{account.followers.toLocaleString()} followers</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border-2 border-sky-200 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-50 transition-all duration-300 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="px-4 py-2 bg-white border-2 border-sky-200 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-50 transition-all duration-300 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Profile
            </button>
            <motion.button
              onClick={() => onDisconnect(account.id)}
              disabled={disconnecting}
              className="px-4 py-2 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl text-sm hover:bg-red-50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              whileHover={!disconnecting ? { scale: 1.05 } : {}}
              whileTap={!disconnecting ? { scale: 0.95 } : {}}
            >
              {disconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Disconnect
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// OAuth Modal Component
const OAuthModal = ({ platform, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const Icon = platform?.icon;

  useEffect(() => {
    if (platform) {
      // Simulate OAuth flow
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [platform]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectAccount(platform.name);
      onSuccess(platform);
      onClose();
    } catch (error) {
      console.error('Connection error:', error);
      setLoading(false);
    }
  };

  if (!platform) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Connect {platform.name}
          </h2>
          <p className="text-slate-600">
            Authorize PostWise AI to access your {platform.name} account
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Connecting to {platform.name}...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <p className="text-sm text-slate-700 font-medium mb-2">
                PostWise AI will be able to:
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Read your posts and engagement metrics</li>
                <li>• Analyze your content performance</li>
                <li>• Suggest improvements for your posts</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleConnect}
                className={`flex-1 py-3 px-4 bg-gradient-to-r ${platform.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Authorize
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
    <div className="animate-pulse">
      <div className="w-16 h-16 bg-sky-200 rounded-2xl mb-4"></div>
      <div className="h-6 bg-sky-200 rounded-lg w-3/4 mb-2"></div>
      <div className="h-4 bg-sky-200 rounded-lg w-full mb-4"></div>
      <div className="h-10 bg-sky-200 rounded-xl w-full"></div>
    </div>
  </div>
);

// Main Connect Accounts Component
const ConnectAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [disconnectingId, setDisconnectingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await fetchConnectedAccounts();
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error('Error loading connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform) => {
    setSelectedPlatform(platform);
    setShowModal(true);
  };

  const handleConnectionSuccess = async (platform) => {
    // Reload accounts after successful connection
    await loadConnectedAccounts();
  };

  const handleDisconnect = async (accountId) => {
    setDisconnectingId(accountId);
    try {
      await disconnectAccount(accountId);
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (error) {
      console.error('Error disconnecting account:', error);
    } finally {
      setDisconnectingId(null);
    }
  };

  const isPlatformConnected = (platformId) => {
    return connectedAccounts.some(acc => 
      acc.platform.toLowerCase().replace(/\s+/g, '') === platformId.toLowerCase()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center gap-3 mb-4"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Link2 className="w-10 h-10 text-sky-500" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Connect Your Social Media
            </h1>
          </motion.div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Link accounts to analyze, plan, and improve your posts automatically
          </p>
        </motion.div>

        {/* Connected Accounts Section */}
        {!loading && connectedAccounts.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              Connected Accounts
            </h2>
            <div className="space-y-4">
              {connectedAccounts.map((account, index) => (
                <ConnectedAccountCard
                  key={account.id}
                  account={account}
                  onDisconnect={handleDisconnect}
                  disconnecting={disconnectingId === account.id}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Platforms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Link2 className="w-6 h-6 text-sky-500" />
            {connectedAccounts.length > 0 ? 'Add More Platforms' : 'Available Platforms'}
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlatforms.map((platform) => (
                <ConnectCard
                  key={platform.id}
                  platform={platform}
                  isConnected={isPlatformConnected(platform.id)}
                  onConnect={handleConnect}
                  connecting={connectingPlatform === platform.id}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* OAuth Modal */}
      <AnimatePresence>
        {showModal && (
          <OAuthModal
            platform={selectedPlatform}
            onClose={() => {
              setShowModal(false);
              setSelectedPlatform(null);
            }}
            onSuccess={handleConnectionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectAccounts;