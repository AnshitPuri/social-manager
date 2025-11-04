import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, BarChart3, FileText, Instagram, Twitter, Facebook, Linkedin, Youtube, Eye, RefreshCw, Sparkles, Loader2, Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// --- MOCK AUTHENTICATION CONTEXT ---
// This mock hook simulates the presence of an AuthContext for a self-contained file.
const useAuth = () => {
  const user = {
    displayName: "Content Creator", // Used in the greeting
    email: "creator@postwise.ai",
    uid: "pw-user-7890-a7b3-c1d5",
  };
  return { user };
};

// --- MOCK API FUNCTIONS (replace with actual API calls) ---
const fetchOverallStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalAccounts: 8,
    totalFollowers: 247800,
    avgEngagement: 4.8,
    totalPosts: 1243
  };
};

const fetchAccountStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return [
    {
      id: 1,
      platform: 'Instagram',
      handle: '@postwiseai',
      followers: 125000,
      engagement: 5.2,
      posts: 432,
      status: 'connected',
      trend: [4.2, 4.5, 4.8, 5.0, 5.1, 5.2],
      icon: Instagram,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 2,
      platform: 'Twitter',
      handle: '@postwise_ai',
      followers: 68000,
      engagement: 3.8,
      posts: 567,
      status: 'connected',
      trend: [3.2, 3.4, 3.6, 3.7, 3.8, 3.8],
      icon: Twitter,
      color: 'from-sky-400 to-blue-500'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      handle: 'PostWise AI',
      followers: 34500,
      engagement: 6.1,
      posts: 198,
      status: 'connected',
      trend: [5.5, 5.7, 5.9, 6.0, 6.0, 6.1],
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 4,
      platform: 'Facebook',
      handle: 'PostWiseAI',
      followers: 15300,
      engagement: 2.9,
      posts: 89,
      status: 'connected',
      trend: [2.5, 2.6, 2.7, 2.8, 2.9, 2.9],
      icon: Facebook,
      color: 'from-blue-500 to-sky-600'
    },
    {
      id: 5,
      platform: 'YouTube',
      handle: 'PostWise AI',
      followers: 5000,
      engagement: 7.2,
      posts: 45,
      status: 'connected',
      trend: [6.8, 6.9, 7.0, 7.1, 7.1, 7.2],
      icon: Youtube,
      color: 'from-red-500 to-red-600'
    }
  ];
};

const fetchRecentActivity = async () => {
  await new Promise(resolve => setTimeout(resolve, 1400));
  return [
    {
      id: 1,
      caption: 'Excited to announce our new AI-powered content optimization features! 🚀',
      platform: 'Instagram',
      likes: 1240,
      comments: 87,
      shares: 45,
      timestamp: '2 hours ago',
      icon: Instagram
    },
    {
      id: 2,
      caption: 'How to boost your social media engagement in 2025 - New blog post',
      platform: 'LinkedIn',
      likes: 892,
      comments: 134,
      shares: 289,
      timestamp: '5 hours ago',
      icon: Linkedin
    },
    {
      id: 3,
      caption: 'Thread: 10 tips for creating viral content that actually converts',
      platform: 'Twitter',
      likes: 2340,
      comments: 156,
      shares: 678,
      timestamp: '1 day ago',
      icon: Twitter
    }
  ];
};

// --- HELPER COMPONENTS ---

// Animated Counter Component for dynamic numerical display
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Use the actual value when animation is complete, otherwise interpolate
      setCount(progress < 1 ? Math.floor(progress * value) : value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  // Format the number or keep the fixed-point string if it contains a decimal
  const formattedValue = typeof value === 'number' ? count.toLocaleString() : count.toFixed(1);

  return <span>{formattedValue}</span>;
};

// Stats Card Component for key metrics
const StatsCard = ({ icon: Icon, title, value, subtitle, delay }) => (
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
      <AnimatedCounter value={value} />
      {subtitle === '%' && '%'}
    </motion.div>
    <div className="text-slate-600 text-sm">
      {subtitle !== '%' && subtitle}
    </div>
  </motion.div>
);

// Account Card Component for platform-specific data
const AccountCard = ({ account, delay }) => {
  const Icon = account.icon;
  // Recharts requires data in an array of objects
  const trendData = account.trend.map((value, index) => ({ value, index }));

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-lg cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5, shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${account.color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{account.platform}</h3>
            <p className="text-sm text-slate-500">{account.handle}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-300">
          {account.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 border border-sky-100 text-center">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Followers</p>
          <p className="text-lg font-bold text-sky-600">{(account.followers / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-sky-100 text-center">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Engagement</p>
          <p className="text-lg font-bold text-sky-600">{account.engagement}%</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-sky-100 text-center">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Posts</p>
          <p className="text-lg font-bold text-sky-600">{account.posts}</p>
        </div>
      </div>

      <div className="h-16 bg-white rounded-xl p-3 border border-sky-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 text-center mt-1">6-month engagement trend</p>
      </div>
    </motion.div>
  );
};

// Activity Card Component for recent posts and metrics
const ActivityCard = ({ activity, delay }) => {
  const Icon = activity.icon;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.01, y: -3, shadow: '0 5px 10px -3px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-md flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-slate-800 font-semibold mb-3 leading-relaxed">{activity.caption}</p>
          
          <div className="flex items-center gap-4 mb-4 border-b pb-4 border-sky-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-semibold">{activity.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <MessageCircle className="w-4 h-4 text-sky-500" />
              <span className="text-sm font-semibold">{activity.comments}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Share2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold">{activity.shares}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 ml-auto">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">{activity.timestamp}</span>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <motion.button 
              className="px-4 py-2 bg-white border-2 border-sky-200 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              View Post
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-white border-2 border-sky-200 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Re-Analyze
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl text-sm hover:from-sky-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              Improve Content
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
    <div className="animate-pulse">
      <div className="h-6 bg-sky-200 rounded-lg w-3/4 mb-4"></div>
      <div className="h-10 bg-sky-200 rounded-lg w-1/2 mb-3"></div>
      <div className="h-4 bg-sky-200 rounded-lg w-2/3"></div>
    </div>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---
const DashboardPage = () => {
  const { user } = useAuth(); // Integrated Auth
  const [overallStats, setOverallStats] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, accts, acts] = await Promise.all([
          fetchOverallStats(),
          fetchAccountStats(),
          fetchRecentActivity()
        ]);
        setOverallStats(stats);
        setAccounts(accts);
        setActivities(acts);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Animated background elements (framer-motion) */}
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
        
        {/* Header and Welcome Message */}
        <motion.div
          className="text-center mb-12 bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-sky-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center justify-center gap-3">
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
            <h2 className="text-2xl font-semibold text-slate-800 mt-4">
               Welcome back, {user?.displayName || 'User'}! 👋
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Monitor your social media performance and engagement in real-time.
            </p>
          </div>
        </motion.div>

        {/* Overall Stats */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b-2 border-sky-200 pb-2">
            <TrendingUp className="w-6 h-6 text-sky-500" />
            Performance Overview
          </h2>
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
              />
              <StatsCard
                icon={TrendingUp}
                title="Total Followers"
                value={overallStats.totalFollowers}
                subtitle="Across all platforms"
                delay={0.5}
              />
              <StatsCard
                icon={BarChart3}
                title="Avg Engagement"
                value={overallStats.avgEngagement}
                subtitle="%"
                delay={0.6}
              />
              <StatsCard
                icon={FileText}
                title="Posts Analyzed"
                value={overallStats.totalPosts}
                subtitle="Total posts"
                delay={0.7}
              />
            </div>
          ) : (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-2xl border border-red-200">
              Failed to load overall stats
            </div>
          )}
        </motion.section>

        {/* Connected Accounts */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b-2 border-sky-200 pb-2">
            <Users className="w-6 h-6 text-sky-500" />
            Platform Deep Dive
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : accounts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accounts.map((account, index) => (
                <AccountCard key={account.id} account={account} delay={0.9 + index * 0.1} />
              ))}
            </div>
          ) : (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-2xl border border-red-200">
              Failed to load accounts
            </div>
          )}
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b-2 border-sky-200 pb-2">
            <Sparkles className="w-6 h-6 text-sky-500" />
            Recent Content & Activity
          </h2>
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : activities ? (
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} delay={1.3 + index * 0.1} />
              ))}
            </div>
          ) : (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-2xl border border-red-200">
              Failed to load activities
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default DashboardPage;
