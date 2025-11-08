import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Hash, Music, MessageSquare, Sparkles, RefreshCw, Target, Clock, ArrowRight, CheckCircle, Play, Instagram, Twitter, Volume2, AlertCircle, Flame, Loader2, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase/config.js';

const API_BASE_URL = 'http://localhost:5000/api';

const TrendHijackingPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [generatingIdea, setGeneratingIdea] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [userNiche, setUserNiche] = useState('Digital Marketing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Real-time data state
  const [trendingData, setTrendingData] = useState({
    hashtags: [],
    sounds: [],
    topics: []
  });

  const niches = [
    'Digital Marketing',
    'Fitness & Health',
    'Tech & SaaS',
    'E-commerce',
    'Content Creation',
    'Finance & Investing',
    'Education',
    'Lifestyle',
    'Food & Cooking',
    'Travel & Adventure'
  ];

  // Get auth headers
  const getAuthHeaders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const token = await user.getIdToken();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    } catch (err) {
      console.error('Auth error:', err);
      throw err;
    }
  };

  // Fetch real-time trending data
  const fetchTrends = async () => {
    setLoading(true);
    setError('');
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/trends/fetch`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          niche: userNiche,
          platforms: ['twitter', 'tiktok', 'reddit']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trends');
      }

      const data = await response.json();
      
      if (data.success) {
        setTrendingData({
          hashtags: data.hashtags || [],
          sounds: data.sounds || [],
          topics: data.topics || []
        });
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to load trends');
      }
    } catch (err) {
      console.error('Fetch trends error:', err);
      setError(err.message || 'Failed to load trending data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh on niche change
  useEffect(() => {
    fetchTrends();
  }, [userNiche]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTrends();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userNiche]);

  const generateContentIdea = async (trend) => {
    setGeneratingIdea(true);
    setSelectedTrend(trend);
    setActiveTab('generate');
    setError('');

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/trends/generate-idea`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          trend: trend,
          niche: userNiche,
          type: trend.tag ? 'hashtag' : trend.name ? 'sound' : 'topic'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate idea');
      }

      const data = await response.json();
      
      if (data.success) {
        setGeneratedIdea(data.idea);
      } else {
        throw new Error(data.error || 'Failed to generate idea');
      }
    } catch (err) {
      console.error('Generate idea error:', err);
      setError(err.message || 'Failed to generate content idea. Please try again.');
      setActiveTab('discover');
    } finally {
      setGeneratingIdea(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getVelocityColor = (velocity) => {
    switch(velocity) {
      case 'viral': return 'text-red-600 bg-red-100 border-red-300';
      case 'hot': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'trending': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getVelocityIcon = (velocity) => {
    switch(velocity) {
      case 'viral': return Flame;
      case 'hot': return Zap;
      case 'trending': return TrendingUp;
      default: return Clock;
    }
  };

  const getPlatformIcon = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'tiktok': return Music;
      default: return MessageSquare;
    }
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600';
    if (match >= 80) return 'text-blue-600';
    if (match >= 70) return 'text-orange-600';
    return 'text-gray-600';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeAgo = () => {
    if (!lastUpdated) return 'Never';
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const totalTrends = trendingData.hashtags.length + trendingData.sounds.length + trendingData.topics.length;
  const viralTrends = [...trendingData.hashtags, ...trendingData.sounds, ...trendingData.topics]
    .filter(t => t.velocity === 'viral').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Real-Time Trend Hijacking
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Detect trending topics and instantly generate viral content ideas
                </p>
              </div>
            </div>
            <motion.button
              onClick={fetchTrends}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 rounded-xl shadow-lg transition-all disabled:opacity-50 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-5 h-5 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-bold text-slate-700">Refresh</span>
            </motion.button>
          </div>

          {/* Enhanced Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-red-100"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-semibold text-slate-600">Viral Trends</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{viralTrends}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-green-100"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-slate-600">Total Trends</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalTrends}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-purple-100"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-slate-600">Your Niche</span>
              </div>
              <p className="text-lg font-bold text-purple-600">{userNiche}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-blue-100"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-slate-600">Last Updated</span>
              </div>
              <p className="text-lg font-bold text-blue-600">{getTimeAgo()}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-center gap-3 shadow-lg"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy Success Notification */}
        <AnimatePresence>
          {copySuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Niche Selector */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border-2 border-sky-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-sky-500" />
            Select Your Niche
          </h3>
          <div className="flex flex-wrap gap-3">
            {niches.map((niche) => (
              <motion.button
                key={niche}
                onClick={() => setUserNiche(niche)}
                disabled={loading}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                  userNiche === niche
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg border-2 border-sky-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {niche}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-2 border-sky-100">
          {[
            { id: 'discover', label: 'Discover Trends', icon: TrendingUp },
            { id: 'generate', label: 'Generate Ideas', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && activeTab === 'discover' && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border-2 border-sky-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-20 h-20 text-sky-500 mx-auto mb-6 animate-spin" />
            <h3 className="text-3xl font-bold text-slate-800 mb-3">Loading Trending Data...</h3>
            <p className="text-lg text-slate-600">Fetching real-time trends from multiple platforms</p>
          </motion.div>
        )}

        {/* Discover Trends Section */}
        {activeTab === 'discover' && !loading && (
          <div className="space-y-6">
            {/* Trending Hashtags */}
            {trendingData.hashtags.length > 0 && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-sky-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Hash className="w-6 h-6 text-sky-600" />
                  </div>
                  Trending Hashtags
                  <span className="text-base font-normal text-slate-500 ml-2">({trendingData.hashtags.length})</span>
                </h3>
                <div className="space-y-3">
                  {trendingData.hashtags.map((trend, idx) => {
                    const VelocityIcon = getVelocityIcon(trend.velocity);
                    const PlatformIcon = getPlatformIcon(trend.platform);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:shadow-lg transition-all cursor-pointer border-2 border-slate-100 hover:border-sky-300 group"
                        onClick={() => generateContentIdea(trend)}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-sky-100 transition-colors">
                              <PlatformIcon className="w-6 h-6 text-slate-500 group-hover:text-sky-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{trend.tag}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getVelocityColor(trend.velocity)}`}>
                                  <VelocityIcon className="w-3 h-3 inline mr-1" />
                                  {trend.velocity.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-slate-600">
                                <span className="flex items-center gap-2 font-semibold">
                                  <MessageSquare className="w-4 h-4" />
                                  {formatNumber(trend.posts || trend.volume)} posts
                                </span>
                                <span className="flex items-center gap-2 text-green-600 font-semibold">
                                  <TrendingUp className="w-4 h-4" />
                                  {trend.growth}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getMatchColor(trend.match)}`}>
                              {trend.match}%
                            </div>
                            <div className="text-xs text-slate-500 font-semibold">Niche Match</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Trending Sounds */}
            {trendingData.sounds.length > 0 && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-purple-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Volume2 className="w-6 h-6 text-purple-600" />
                  </div>
                  Trending Audio
                  <span className="text-base font-normal text-slate-500 ml-2">({trendingData.sounds.length})</span>
                </h3>
                <div className="space-y-3">
                  {trendingData.sounds.map((trend, idx) => {
                    const PlatformIcon = getPlatformIcon(trend.platform);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-5 bg-gradient-to-r from-purple-50 to-white rounded-xl hover:shadow-lg transition-all cursor-pointer border-2 border-purple-100 hover:border-purple-300 group"
                        onClick={() => generateContentIdea(trend)}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                              <Music className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{trend.name}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getVelocityColor(trend.velocity)}`}>
                                  {trend.velocity.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-slate-600">
                                <span className="flex items-center gap-2 font-semibold">
                                  <Play className="w-4 h-4" />
                                  {formatNumber(trend.uses)} uses
                                </span>
                                <span className="flex items-center gap-2 text-green-600 font-semibold">
                                  <TrendingUp className="w-4 h-4" />
                                  {trend.growth}
                                </span>
                                <PlatformIcon className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getMatchColor(trend.match)}`}>
                              {trend.match}%
                            </div>
                            <div className="text-xs text-slate-500 font-semibold">Niche Match</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Trending Topics */}
            {trendingData.topics.length > 0 && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-orange-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  Hot Topics & Discussions
                  <span className="text-base font-normal text-slate-500 ml-2">({trendingData.topics.length})</span>
                </h3>
                <div className="space-y-3">
                  {trendingData.topics.map((trend, idx) => {
                    const PlatformIcon = getPlatformIcon(trend.platform);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-5 bg-gradient-to-r from-orange-50 to-white rounded-xl hover:shadow-lg transition-all cursor-pointer border-2 border-orange-100 hover:border-orange-300 group"
                        onClick={() => generateContentIdea(trend)}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                              <PlatformIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{trend.topic}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getVelocityColor(trend.velocity)}`}>
                                  {trend.velocity.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-slate-600">
                                <span className="flex items-center gap-2 font-semibold">
                                  <MessageSquare className="w-4 h-4" />
                                  {formatNumber(trend.discussions)} discussions
                                </span>
                                <span className="flex items-center gap-2 text-green-600 font-semibold">
                                  <TrendingUp className="w-4 h-4" />
                                  {trend.growth}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getMatchColor(trend.match)}`}>
                              {trend.match}%
                            </div>
                            <div className="text-xs text-slate-500 font-semibold">Niche Match</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* No Trends Found */}
            {!loading && totalTrends === 0 && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border-2 border-sky-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-slate-800 mb-3">No Trends Found</h3>
                <p className="text-lg text-slate-600 mb-8">Try selecting a different niche or refresh to load new trends</p>
                <motion.button
                  onClick={fetchTrends}
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Refresh Trends
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

        {/* Generate Ideas Section */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            {generatingIdea ? (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border-2 border-sky-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <RefreshCw className="w-20 h-20 text-sky-500 mx-auto mb-6 animate-spin" />
                <h3 className="text-3xl font-bold text-slate-800 mb-3">Generating Content Ideas...</h3>
                <p className="text-lg text-slate-600">AI is analyzing the trend and matching with your niche</p>
              </motion.div>
            ) : generatedIdea ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-sky-100"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-slate-800 mb-3">{generatedIdea.title}</h3>
                    <div className="flex items-start gap-2 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border-2 border-sky-200">
                      <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <p className="text-lg text-sky-700 italic font-semibold">{generatedIdea.hook}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setGeneratedIdea(null);
                      setSelectedTrend(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-2 transition-all text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Content Description */}
                  <div className="p-5 bg-gradient-to-br from-sky-50 to-white rounded-xl border-2 border-sky-100">
                    <h4 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-sky-600" />
                      Content Strategy
                    </h4>
                    <p className="text-slate-700 leading-relaxed">{generatedIdea.content}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      className="p-5 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border-2 border-blue-200"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Estimated Reach</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{generatedIdea.estimatedReach}</p>
                    </motion.div>
                    <motion.div 
                      className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Zap className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Engagement Rate</span>
                      </div>
                      <p className="text-3xl font-bold text-green-600">{generatedIdea.engagementPrediction}</p>
                    </motion.div>
                  </div>

                  {/* Format & Platforms */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-purple-100">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Play className="w-5 h-5 text-purple-600" />
                        Content Format
                      </h4>
                      <span className="inline-block px-5 py-2.5 bg-purple-100 text-purple-700 rounded-xl font-bold text-base border-2 border-purple-200">
                        {generatedIdea.format}
                      </span>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-white rounded-xl border-2 border-amber-100">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-amber-600" />
                        Best Platforms
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {generatedIdea.platforms.map((platform, idx) => (
                          <span key={idx} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold border-2 border-amber-200">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hashtags/Keywords */}
                  {generatedIdea.hashtags && generatedIdea.hashtags.length > 0 && (
                    <div className="p-5 bg-gradient-to-br from-pink-50 to-white rounded-xl border-2 border-pink-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <Hash className="w-5 h-5 text-pink-600" />
                          Recommended Hashtags
                        </h4>
                        <button
                          onClick={() => copyToClipboard(generatedIdea.hashtags.join(' '))}
                          className="flex items-center gap-2 px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-sm font-semibold transition-all"
                        >
                          <Copy className="w-4 h-4" />
                          Copy All
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {generatedIdea.hashtags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm font-semibold border border-pink-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <motion.button 
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Sparkles className="w-6 h-6" />
                      Create This Content
                    </motion.button>
                    <motion.button 
                      onClick={() => {
                        setGeneratedIdea(null);
                        setSelectedTrend(null);
                        setActiveTab('discover');
                      }}
                      className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg rounded-xl transition-all border-2 border-slate-200"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Browse More Trends
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border-2 border-sky-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-6 bg-sky-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-sky-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-3">Select a Trend to Generate Ideas</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Go to "Discover Trends" and click on any trend to generate AI-powered content ideas tailored to your niche</p>
                <motion.button
                  onClick={() => setActiveTab('discover')}
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Trends
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrendHijackingPage;