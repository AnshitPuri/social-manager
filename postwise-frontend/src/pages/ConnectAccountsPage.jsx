import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Instagram, Twitter, Facebook, Linkedin, Youtube, CheckCircle, X, Loader2, Settings, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { auth } from '../firebase/config.js';

const API_BASE_URL = 'http://localhost:5000/api';

// Available platforms configuration
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

// API Functions with Firebase Auth
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const fetchConnectedAccounts = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    headers
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  
  const data = await response.json();
  
  // Transform API response to match component structure
  return data.data.map(account => ({
    id: account.id,
    platform: account.platform,
    username: account.username,
    followers: account.followers || 0,
    connected: account.isConnected,
    icon: getPlatformIcon(account.platform),
    color: getPlatformColor(account.platform),
    engagement: account.engagement || 0,
    profilePic: account.profilePic
  }));
};

const connectAccount = async (platform, username, accessToken = null) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/accounts/connect`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      platform: platform.name,
      username,
      accessToken
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to connect account');
  }
  
  return await response.json();
};

const disconnectAccount = async (accountId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to disconnect account');
  }
  
  return await response.json();
};

// Helper functions
const getPlatformIcon = (platformName) => {
  const platform = availablePlatforms.find(p => 
    p.name.toLowerCase() === platformName.toLowerCase() ||
    p.id === platformName.toLowerCase()
  );
  return platform?.icon || Link2;
};

const getPlatformColor = (platformName) => {
  const platform = availablePlatforms.find(p => 
    p.name.toLowerCase() === platformName.toLowerCase() ||
    p.id === platformName.toLowerCase()
  );
  return platform?.color || 'from-gray-500 to-gray-600';
};

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

      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">{platform.name}</h3>
      <p className="text-sm text-slate-600 mb-4">{platform.description}</p>

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
            <div className="flex items-center gap-2 text-slate-600">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold">{account.engagement}% engagement</span>
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
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const Icon = platform?.icon;

  const handleConnect = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await connectAccount(platform, username);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect account');
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
            Enter your {platform.name} username to connect
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`@${platform.id}username`}
              className="w-full px-4 py-3 bg-white border-2 border-sky-200 rounded-xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 text-slate-800"
              disabled={loading}
            />
          </div>

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
              disabled={loading}
              className="flex-1 py-3 px-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleConnect}
              disabled={loading}
              className={`flex-1 py-3 px-4 bg-gradient-to-r ${platform.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Account'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton
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

// Main Component
const ConnectAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disconnectingId, setDisconnectingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const accounts = await fetchConnectedAccounts();
      setConnectedAccounts(accounts);
    } catch (err) {
      console.error('Error loading connected accounts:', err);
      setError(err.message || 'Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform) => {
    setSelectedPlatform(platform);
    setShowModal(true);
  };

  const handleConnectionSuccess = async () => {
    await loadConnectedAccounts();
  };

  const handleDisconnect = async (accountId) => {
    setDisconnectingId(accountId);
    try {
      await disconnectAccount(accountId);
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (err) {
      console.error('Error disconnecting account:', err);
      setError(err.message || 'Failed to disconnect account');
    } finally {
      setDisconnectingId(null);
    }
  };

  const isPlatformConnected = (platformId) => {
    return connectedAccounts.some(acc => 
      acc.platform.toLowerCase().replace(/\s+/g, '').includes(platformId.toLowerCase()) ||
      platformId.toLowerCase().includes(acc.platform.toLowerCase().replace(/\s+/g, ''))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
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

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <X className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Connected Accounts */}
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
              {connectedAccounts.map((account) => (
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

        {/* Available Platforms */}
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
                  connecting={false}
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