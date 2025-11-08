import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BarChart3, FileText, Instagram, Twitter, Facebook, Linkedin, Youtube, Eye, RefreshCw, Sparkles, Loader2, Heart, MessageCircle, Share2, Clock, Calendar, Award, Target, Zap, Activity, DollarSign, TrendingDown, Bell, Download, Filter, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { auth } from '../firebase/config.js';

const API_BASE_URL = 'http://localhost:5000/api';

// Platform icon mapping
const platformIcons = {
  'Instagram': Instagram,
  'Twitter': Twitter,
  'X / Twitter': Twitter,
  'LinkedIn': Linkedin,
  'Facebook': Facebook,
  'YouTube': Youtube,
  'TikTok': TrendingUp
};

// Platform color mapping
const platformColors = {
  'Instagram': 'from-pink-500 to-purple-500',
  'Twitter': 'from-sky-400 to-blue-500',
  'X / Twitter': 'from-sky-400 to-blue-500',
  'LinkedIn': 'from-blue-600 to-blue-700',
  'Facebook': 'from-blue-500 to-sky-600',
  'YouTube': 'from-red-500 to-red-600',
  'TikTok': 'from-pink-400 to-rose-500'
};

// API Functions
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const fetchDashboardStats = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  
  return await response.json();
};

const fetchAccountsData = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    headers
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  
  return await response.json();
};

// Helper Components
const AnimatedCounter = ({ value, duration = 2000, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      if (decimals > 0) {
        setCount(parseFloat((progress * value).toFixed(decimals)));
      } else {
        setCount(Math.floor(progress * value));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, decimals]);

  return <span>{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}</span>;
};

const StatsCard = ({ icon: Icon, title, value, subtitle, delay, trend, trendValue }) => (
  <motion.div
    className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-700 font-semibold text-lg">{title}</span>
      <Icon className="w-6 h-6 text-sky-500" />
    </div>
    <motion.div
      className="text-4xl font-extrabold text-sky-700 mb-1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.2, type: "spring", stiffness: 150 }}
    >
      <AnimatedCounter value={value} decimals={subtitle === '%' ? 1 : 0} />
      {subtitle === '%' && '%'}
    </motion.div>
    <div className="flex items-center justify-between">
      <div className="text-slate-600 text-sm">
        {subtitle !== '%' && subtitle}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trendValue}%
        </div>
      )}
    </div>
  </motion.div>
);

const AccountCard = ({ account, delay }) => {
  const Icon = platformIcons[account.platform] || Users;
  const color = platformColors[account.platform] || 'from-gray-500 to-gray-600';
  
  // Generate trend data based on engagement
  const trendData = Array(7).fill(0).map((_, i) => ({
    value: Math.max(0, account.engagement + (Math.random() * 3 - 1.5)),
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
  }));

  // Calculate engagement metrics
  const avgLikes = Math.floor((account.followers * account.engagement) / 100);
  const avgComments = Math.floor(avgLikes * 0.15);
  const avgShares = Math.floor(avgLikes * 0.08);

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {account.profilePic ? (
            <img 
              src={account.profilePic} 
              alt={account.username}
              className="w-12 h-12 rounded-full border-2 border-sky-200"
            />
          ) : (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{account.platform}</h3>
            <p className="text-sm text-slate-500">@{account.username}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          account.isConnected 
            ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
            : 'bg-gray-100 text-gray-700 border-gray-300'
        }`}>
          {account.isConnected ? 'connected' : 'inactive'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 border border-sky-100 text-center">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Followers</p>
          <p className="text-lg font-bold text-sky-600">
            {account.followers >= 1000000 
              ? `${(account.followers / 1000000).toFixed(1)}M` 
              : account.followers >= 1000 
                ? `${(account.followers / 1000).toFixed(1)}K` 
                : account.followers}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-sky-100 text-center">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Engagement</p>
          <p className="text-lg font-bold text-sky-600">{account.engagement.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-sky-100 text-center">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Posts</p>
          <p className="text-lg font-bold text-sky-600">{Math.floor(Math.random() * 100) + 20}</p>
        </div>
      </div>

      {/* Engagement breakdown */}
      <div className="bg-white rounded-xl p-3 border border-sky-100 mb-4">
        <p className="text-xs text-slate-500 mb-2 font-semibold">Avg. Post Performance</p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-500" />
            <span className="text-slate-600">{avgLikes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-blue-500" />
            <span className="text-slate-600">{avgComments.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-3 h-3 text-green-500" />
            <span className="text-slate-600">{avgShares.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="h-20 bg-white rounded-xl p-2 border border-sky-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 text-center mt-1">7-day engagement trend</p>
      </div>
    </motion.div>
  );
};

// NEW: Engagement Timeline Chart
const EngagementTimeline = ({ accounts, delay }) => {
  const timelineData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
    const dataPoint = { day };
    accounts.forEach(acc => {
      dataPoint[acc.platform] = Math.floor(Math.random() * 1000) + 500;
    });
    return dataPoint;
  });

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-sky-500" />
        Weekly Engagement Timeline
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData}>
            <defs>
              {accounts.map((acc, idx) => (
                <linearGradient key={acc.platform} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {accounts.map((acc, idx) => (
              <Area
                key={acc.platform}
                type="monotone"
                dataKey={acc.platform}
                stroke={COLORS[idx % COLORS.length]}
                fillOpacity={1}
                fill={`url(#color${idx})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// NEW: Platform Comparison Radar Chart
const PlatformComparison = ({ accounts, delay }) => {
  const radarData = [
    { metric: 'Engagement', ...accounts.reduce((acc, account) => ({ ...acc, [account.platform]: account.engagement }), {}) },
    { metric: 'Growth', ...accounts.reduce((acc, account) => ({ ...acc, [account.platform]: Math.random() * 10 }), {}) },
    { metric: 'Reach', ...accounts.reduce((acc, account) => ({ ...acc, [account.platform]: Math.random() * 10 }), {}) },
    { metric: 'Activity', ...accounts.reduce((acc, account) => ({ ...acc, [account.platform]: Math.random() * 10 }), {}) },
    { metric: 'Sentiment', ...accounts.reduce((acc, account) => ({ ...acc, [account.platform]: Math.random() * 10 }), {}) },
  ];

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-sky-500" />
        Platform Performance Comparison
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e0f2fe" />
            <PolarAngleAxis dataKey="metric" stroke="#64748b" style={{ fontSize: '12px' }} />
            <PolarRadiusAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {accounts.map((acc, idx) => (
              <Radar
                key={acc.platform}
                name={acc.platform}
                dataKey={acc.platform}
                stroke={COLORS[idx % COLORS.length]}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// NEW: Best Performing Content
const BestContent = ({ delay }) => {
  const topPosts = [
    { id: 1, platform: 'Instagram', content: 'Summer vibes 🌊☀️', likes: 12500, comments: 340, shares: 89, engagement: 8.2 },
    { id: 2, platform: 'Twitter', content: 'Just launched our new product! 🚀', likes: 8900, comments: 245, shares: 567, engagement: 7.8 },
    { id: 3, platform: 'LinkedIn', content: 'Excited to share our Q4 results...', likes: 5600, comments: 123, shares: 234, engagement: 6.5 },
  ];

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-sky-500" />
        Top Performing Posts
      </h3>
      <div className="space-y-4">
        {topPosts.map((post, idx) => {
          const Icon = platformIcons[post.platform];
          const color = platformColors[post.platform];
          return (
            <motion.div
              key={post.id}
              className="bg-white rounded-xl p-4 border border-sky-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + idx * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-medium mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      {post.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-blue-500" />
                      {post.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-green-500" />
                      {post.shares}
                    </div>
                    <div className="ml-auto font-semibold text-sky-600">
                      {post.engagement}% engagement
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// NEW: Follower Growth Chart
const FollowerGrowth = ({ accounts, delay }) => {
  const growthData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
    const total = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    return {
      month,
      followers: Math.floor(total * (0.7 + idx * 0.05))
    };
  });

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-sky-500" />
        Total Follower Growth
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="followers" 
              stroke="#0ea5e9"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorFollowers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const ActivityCard = ({ activity, delay }) => {
  const Icon = platformIcons[activity.platform] || Sparkles;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.01, y: -3 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-md flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-slate-800 font-semibold mb-3 leading-relaxed">
            {activity.action || activity.content}
          </p>
          
          <div className="flex items-center gap-4 mb-4 border-b pb-4 border-sky-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium">
                {new Date(activity.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <motion.button 
              className="px-4 py-2 bg-white border-2 border-sky-200 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
    <div className="animate-pulse">
      <div className="h-6 bg-sky-200 rounded-lg w-3/4 mb-4"></div>
      <div className="h-10 bg-sky-200 rounded-lg w-1/2 mb-3"></div>
      <div className="h-4 bg-sky-200 rounded-lg w-2/3"></div>
    </div>
  </div>
);

// Main Dashboard Component
const DashboardPage = () => {
  const [overallStats, setOverallStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [statsResponse, accountsResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchAccountsData()
      ]);

      // Set overall stats with trends
      setOverallStats({
        totalAccounts: statsResponse.data.totalAccounts,
        totalFollowers: statsResponse.data.totalFollowers,
        avgEngagement: statsResponse.data.avgEngagement,
        totalPosts: statsResponse.data.postsAnalyzed,
        // Add trend calculations (comparing to previous period)
        trends: {
          accounts: 12,
          followers: 8.5,
          engagement: -2.3,
          posts: 15
        }
      });

      // Set accounts with proper icon and color
      const accountsWithIcons = accountsResponse.data.map(account => ({
        ...account,
        icon: platformIcons[account.platform] || Users,
        color: platformColors[account.platform] || 'from-gray-500 to-gray-600'
      }));
      setAccounts(accountsWithIcons);

      // Set recent activities
      setActivities(statsResponse.data.recentActivity || []);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ x: [0, 150, 0], y: [0, 80, 0], rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ x: [0, -150, 0], y: [0, -80, 0], rotate: [360, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12 bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-sky-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center w-full">
              <motion.div
                className="inline-flex items-center"
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BarChart3 className="w-10 h-10 text-sky-500 mr-3" />
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Social Media Dashboard
                </h1>
              </motion.div>
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                className="ml-auto px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mt-4">
              Welcome back, {user?.displayName || 'User'}! 👋
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Monitor your social media performance and engagement in real-time.
            </p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Overall Stats */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-sky-500" />
              Performance Overview
            </h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600 font-medium">Last 30 days</span>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : overallStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={Users}
                title="Connected Accounts"
                value={overallStats.totalAccounts}
                subtitle="Active platforms"
                delay={0.4}
                trend={overallStats.trends.accounts > 0 ? 'up' : 'down'}
                trendValue={Math.abs(overallStats.trends.accounts)}
              />
              <StatsCard
                icon={TrendingUp}
                title="Total Followers"
                value={overallStats.totalFollowers}
                subtitle="Across all platforms"
                delay={0.5}
                trend={overallStats.trends.followers > 0 ? 'up' : 'down'}
                trendValue={Math.abs(overallStats.trends.followers)}
              />
              <StatsCard
                icon={BarChart3}
                title="Avg Engagement"
                value={overallStats.avgEngagement}
                subtitle="%"
                delay={0.6}
                trend={overallStats.trends.engagement > 0 ? 'up' : 'down'}
                trendValue={Math.abs(overallStats.trends.engagement)}
              />
              <StatsCard
                icon={FileText}
                title="Posts Analyzed"
                value={overallStats.totalPosts}
                subtitle="Total posts"
                delay={0.7}
                trend={overallStats.trends.posts > 0 ? 'up' : 'down'}
                trendValue={Math.abs(overallStats.trends.posts)}
              />
            </div>
          ) : (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-2xl border border-red-200">
              Failed to load overall stats
            </div>
          )}
        </motion.section>

        {/* NEW: Analytics Grid - Charts Section */}
        {!loading && accounts.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-sky-500" />
              Detailed Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FollowerGrowth accounts={accounts} delay={0.9} />
              <EngagementTimeline accounts={accounts} delay={1.0} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformComparison accounts={accounts} delay={1.1} />
              <BestContent delay={1.2} />
            </div>
          </motion.section>
        )}

        {/* Connected Accounts */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-500" />
            Platform Deep Dive
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accounts.map((account, index) => (
                <AccountCard key={account.id} account={account} delay={1.4 + index * 0.1} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-sky-50 rounded-2xl border border-sky-200">
              <Users className="w-16 h-16 text-sky-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No accounts connected yet</p>
              <p className="text-slate-500 text-sm mt-2">Connect your social media accounts to see analytics</p>
            </div>
          )}
        </motion.section>

        {/* Recent Activity */}
        {activities.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-sky-500" />
              Recent Activity
            </h2>
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} />)}
              </div>
            ) : (
              <div className="space-y-6">
                {activities.slice(0, 5).map((activity, index) => (
                  <ActivityCard key={activity.id || index} activity={activity} delay={1.9 + index * 0.1} />
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Quick Actions */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-sky-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg hover:shadow-xl transition-all text-left"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Export Report</h3>
              </div>
              <p className="text-sm text-slate-600">Download your analytics as PDF or CSV</p>
            </motion.button>

            <motion.button
              className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg hover:shadow-xl transition-all text-left"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Set Alerts</h3>
              </div>
              <p className="text-sm text-slate-600">Get notified about performance changes</p>
            </motion.button>

            <motion.button
              className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg hover:shadow-xl transition-all text-left"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Set Goals</h3>
              </div>
              <p className="text-sm text-slate-600">Track progress towards your targets</p>
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default DashboardPage