import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, FileText, Heart, MessageCircle, Share2, Eye, RefreshCw, Instagram, Twitter, Linkedin, Facebook, ChevronDown, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock API Functions - Replace with actual backend calls
const fetchOverallStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalFollowers: 127500,
    avgEngagement: 4.8,
    totalPosts: 342,
    totalInteractions: 45680
  };
};

const fetchAccountStats = async (platform = 'all') => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const allAccounts = [
    {
      id: 1,
      platform: 'Instagram',
      handle: '@postwise_official',
      followers: 45200,
      engagement: 5.2,
      posts: 156,
      trend: [3.5, 4.2, 4.8, 5.1, 5.2, 5.0, 5.2],
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50'
    },
    {
      id: 2,
      platform: 'Twitter',
      handle: '@PostWiseAI',
      followers: 32800,
      engagement: 4.7,
      posts: 89,
      trend: [4.1, 4.3, 4.5, 4.6, 4.7, 4.8, 4.7],
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-sky-50'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      handle: 'PostWise AI',
      followers: 28500,
      engagement: 6.1,
      posts: 67,
      trend: [5.5, 5.8, 6.0, 6.2, 6.1, 6.0, 6.1],
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      id: 4,
      platform: 'Facebook',
      handle: 'PostWiseAI',
      followers: 21000,
      engagement: 3.2,
      posts: 30,
      trend: [3.0, 3.1, 3.2, 3.3, 3.2, 3.1, 3.2],
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    }
  ];
  
  return platform === 'all' ? allAccounts : allAccounts.filter(acc => acc.platform.toLowerCase() === platform.toLowerCase());
};

const fetchPostPerformance = async (days = 30) => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return [
    {
      id: 1,
      platform: 'Instagram',
      caption: 'Excited to announce our new AI-powered content optimization features! 🚀',
      likes: 1243,
      comments: 87,
      shares: 45,
      engagement: 5.8,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      platform: 'Twitter',
      caption: 'Did you know? Posts optimized with PostWise AI see 3x better engagement...',
      likes: 892,
      comments: 34,
      shares: 156,
      engagement: 6.2,
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      caption: 'The future of social media marketing is here. Learn how AI can transform...',
      likes: 2341,
      comments: 198,
      shares: 432,
      engagement: 8.1,
      timestamp: '1 day ago'
    },
    {
      id: 4,
      platform: 'Instagram',
      caption: 'Behind the scenes: How our AI analyzes millions of posts to give you...',
      likes: 1567,
      comments: 123,
      shares: 89,
      engagement: 5.2,
      timestamp: '2 days ago'
    }
  ];
};

const fetchGrowthData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    followers: [
      { date: 'Week 1', count: 115000 },
      { date: 'Week 2', count: 118500 },
      { date: 'Week 3', count: 122000 },
      { date: 'Week 4', count: 127500 }
    ],
    engagement: [
      { date: 'Week 1', rate: 4.2 },
      { date: 'Week 2', rate: 4.5 },
      { date: 'Week 3', rate: 4.6 },
      { date: 'Week 4', rate: 4.8 }
    ]
  };
};

// Animated Counter Component
const AnimatedCounter = ({ value, decimals = 0, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const currentValue = value * percentage;
      setCount(currentValue);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

// Loading Skeleton
const SkeletonCard = () => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
  </div>
);

// Platform Icon Component
const PlatformIcon = ({ platform, size = 'w-6 h-6' }) => {
  const icons = {
    Instagram: <Instagram className={size} />,
    Twitter: <Twitter className={size} />,
    Facebook: <Facebook className={size} />,
    LinkedIn: <Linkedin className={size} />
  };
  return icons[platform] || null;
};

// Summary Card Component
const SummaryCard = ({ icon: Icon, title, value, subtitle, gradient, delay, decimals = 0, suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.03, y: -5 }}
    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
  >
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-3xl font-bold text-gray-800 mb-1">
      <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
    </div>
    <div className="text-sm text-gray-600 font-medium">{title}</div>
    {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
  </motion.div>
);

// Account Card Component
const AccountCard = ({ account, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.05, y: -8 }}
    className={`${account.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${account.color}`}>
        <PlatformIcon platform={account.platform} size="w-5 h-5" />
      </div>
      <div className="text-xs font-semibold text-gray-600 bg-white/50 px-3 py-1 rounded-full">
        Connected
      </div>
    </div>
    
    <div className="mb-3">
      <div className="text-xl font-bold text-gray-800">{account.platform}</div>
      <div className="text-sm text-gray-600">{account.handle}</div>
    </div>
    
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-white/50 rounded-lg p-2 text-center">
        <div className="text-xs text-gray-600 mb-1">Followers</div>
        <div className="text-sm font-bold text-gray-800">{account.followers.toLocaleString()}</div>
      </div>
      <div className="bg-white/50 rounded-lg p-2 text-center">
        <div className="text-xs text-gray-600 mb-1">Engagement</div>
        <div className="text-sm font-bold text-gray-800">{account.engagement}%</div>
      </div>
      <div className="bg-white/50 rounded-lg p-2 text-center">
        <div className="text-xs text-gray-600 mb-1">Posts</div>
        <div className="text-sm font-bold text-gray-800">{account.posts}</div>
      </div>
    </div>
    
    <div className="h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={account.trend.map((val, idx) => ({ value: val }))}>
          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// Post Performance Card Component
const PostPerformanceCard = ({ post, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.02 }}
    className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          post.platform === 'Instagram' ? 'bg-gradient-to-br from-pink-500 to-purple-600' :
          post.platform === 'Twitter' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
          post.platform === 'LinkedIn' ? 'bg-gradient-to-br from-blue-600 to-blue-800' :
          'bg-gradient-to-br from-blue-500 to-blue-700'
        }`}>
          <PlatformIcon platform={post.platform} size="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-600">{post.platform}</div>
          <div className="text-xs text-gray-500">{post.timestamp}</div>
        </div>
      </div>
    </div>
    
    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{post.caption}</p>
    
    <div className="grid grid-cols-4 gap-2 mb-4">
      <div className="bg-red-50 rounded-lg p-2 text-center">
        <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
        <div className="text-xs font-bold text-gray-800">{post.likes.toLocaleString()}</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-2 text-center">
        <MessageCircle className="w-4 h-4 text-blue-500 mx-auto mb-1" />
        <div className="text-xs font-bold text-gray-800">{post.comments}</div>
      </div>
      <div className="bg-green-50 rounded-lg p-2 text-center">
        <Share2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
        <div className="text-xs font-bold text-gray-800">{post.shares}</div>
      </div>
      <div className="bg-purple-50 rounded-lg p-2 text-center">
        <TrendingUp className="w-4 h-4 text-purple-500 mx-auto mb-1" />
        <div className="text-xs font-bold text-gray-800">{post.engagement}%</div>
      </div>
    </div>
    
    <div className="flex gap-2">
      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-1">
        <Eye className="w-3 h-3" />
        View
      </button>
      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
        <RefreshCw className="w-3 h-3" />
        Analyze
      </button>
    </div>
  </motion.div>
);

// Main Analytics Component
const AnalyticsPage = () => {
  const [overallStats, setOverallStats] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [posts, setPosts] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [dateRange, setDateRange] = useState(30);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  useEffect(() => {
    loadData();
  }, [platformFilter, dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stats, accts, postData, growth] = await Promise.all([
        fetchOverallStats(),
        fetchAccountStats(platformFilter),
        fetchPostPerformance(dateRange),
        fetchGrowthData()
      ]);
      setOverallStats(stats);
      setAccounts(accts);
      setPosts(postData);
      setGrowthData(growth);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const platforms = ['All', 'Instagram', 'Twitter', 'LinkedIn', 'Facebook'];
  const dateRanges = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 p-4 md:p-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your social media performance across all platforms</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          {/* Platform Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPlatformDropdown(!showPlatformDropdown);
                setShowDateDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all text-sm font-semibold text-gray-700"
            >
              <Filter className="w-4 h-4" />
              {platformFilter === 'all' ? 'All Platforms' : platformFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {showPlatformDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl p-2 min-w-[160px] z-20"
                >
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => {
                        setPlatformFilter(platform.toLowerCase());
                        setShowPlatformDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        platformFilter === platform.toLowerCase()
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowPlatformDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all text-sm font-semibold text-gray-700"
            >
              <Calendar className="w-4 h-4" />
              {dateRanges.find(d => d.value === dateRange)?.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {showDateDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl p-2 min-w-[140px] z-20"
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.value);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dateRange === range.value
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Summary Metrics */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : overallStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              icon={Users}
              title="Total Followers"
              value={overallStats.totalFollowers}
              subtitle="Across all platforms"
              gradient="from-blue-500 to-blue-700"
              delay={0}
            />
            <SummaryCard
              icon={TrendingUp}
              title="Avg Engagement Rate"
              value={overallStats.avgEngagement}
              decimals={1}
              suffix="%"
              subtitle="Last 30 days"
              gradient="from-purple-500 to-purple-700"
              delay={0.1}
            />
            <SummaryCard
              icon={FileText}
              title="Total Posts"
              value={overallStats.totalPosts}
              subtitle="Published content"
              gradient="from-green-500 to-green-700"
              delay={0.2}
            />
            <SummaryCard
              icon={Heart}
              title="Total Interactions"
              value={overallStats.totalInteractions}
              subtitle="Likes + Comments"
              gradient="from-pink-500 to-pink-700"
              delay={0.3}
            />
          </div>
        ) : null}

        {/* Growth Trends Charts */}
        {!loading && growthData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Followers Growth */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Followers Growth
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={growthData.followers}>
                  <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Engagement Rate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Engagement Rate
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={growthData.engagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="rate" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Account Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Performance</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : accounts && accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account, idx) => (
                <AccountCard key={account.id} account={account} delay={0.1 * idx} />
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg text-center">
              <p className="text-gray-600">No accounts found for the selected filter.</p>
            </div>
          )}
        </motion.div>

        {/* Post Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Performance</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, idx) => (
                <PostPerformanceCard key={post.id} post={post} delay={0.1 * idx} />
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg text-center">
              <p className="text-gray-600">No posts found for the selected date range.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;