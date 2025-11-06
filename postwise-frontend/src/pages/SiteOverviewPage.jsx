import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Zap, Clock, TrendingUp, Server, AlertCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

// Animated Counter Component
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

// System Stats Card Component
const SystemStatsCard = ({ icon: Icon, title, value, subtitle, color, delay, decimals = 0 }) => (
  <motion.div
    className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-700 font-semibold text-lg">{title}</span>
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <motion.div
      className="text-4xl font-bold text-sky-600 mb-1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.2, type: "spring" }}
    >
      <AnimatedCounter value={value} decimals={decimals} />
      {subtitle === '%' && '%'}
    </motion.div>
    <div className="text-slate-600 text-sm font-medium">
      {subtitle !== '%' && subtitle}
    </div>
  </motion.div>
);

// Chart Panel Component
const ChartPanel = ({ title, data, dataKey, color, delay, type = 'line' }) => (
  <motion.div
    className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.01 }}
  >
    <h3 className="text-slate-700 font-bold text-xl mb-6 flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-sky-500" />
      {title}
    </h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis 
              dataKey="day" 
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
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
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis 
              dataKey="day" 
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// Alert Card Component
const AlertCard = ({ alert, delay }) => {
  const Icon = alert.icon;
  
  const statusStyles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'from-emerald-400 to-emerald-600',
      text: 'text-emerald-700'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'from-amber-400 to-amber-600',
      text: 'text-amber-700'
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      iconBg: 'from-rose-400 to-rose-600',
      text: 'text-rose-700'
    },
    info: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      iconBg: 'from-sky-400 to-blue-600',
      text: 'text-sky-700'
    }
  };

  const style = statusStyles[alert.status] || statusStyles.info;

  return (
    <motion.div
      className={`${style.bg} border-2 ${style.border} rounded-xl p-4 flex items-start gap-3`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.01, x: 5 }}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ${style.iconBg} shadow-md flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${style.text} mb-1 leading-snug`}>
          {alert.title}
        </p>
        <p className="text-slate-500 text-xs font-medium">
          {alert.timestamp}
        </p>
      </div>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = ({ className = "" }) => (
  <div className={`bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md ${className}`}>
    <div className="animate-pulse">
      <div className="h-6 bg-sky-200 rounded-lg w-3/4 mb-4"></div>
      <div className="h-10 bg-sky-200 rounded-lg w-1/2 mb-3"></div>
      <div className="h-4 bg-sky-200 rounded-lg w-2/3"></div>
    </div>
  </div>
);

// Main Site Overview Component
const SiteOverview = () => {
  const [systemStats, setSystemStats] = useState(null);
  const [usageMetrics, setUsageMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch overview data from backend
        const overviewResponse = await api.getOverview();
        
        if (!overviewResponse.success) {
          throw new Error(overviewResponse.error || 'Failed to fetch overview data');
        }

        const overviewData = overviewResponse.data.data;

        // Set system stats
        setSystemStats({
          totalUsers: overviewData.stats.totalUsers || 0,
          totalApiRequests: overviewData.stats.totalApiRequests || 0,
          uptime: overviewData.stats.uptime || 0,
          activeSessions: overviewData.stats.activeSessions || 0
        });

        // Process usage metrics for charts
        const apiRequestsData = overviewData.usageMetrics?.apiRequests || [];
        const activeUsersData = overviewData.usageMetrics?.activeUsers || [];

        setUsageMetrics({
          apiRequests: apiRequestsData,
          activeUsers: activeUsersData
        });

        // Fetch activity feed for alerts
        const activityResponse = await api.getActivity(10);
        
        if (activityResponse.success) {
          // Map activity data to alerts format
          const activityData = activityResponse.data.data || [];
          const mappedAlerts = activityData.map((activity, index) => ({
            id: activity.id || index,
            status: activity.type || 'info', // 'success', 'warning', 'error', 'info'
            title: activity.message || activity.action || 'System activity',
            timestamp: formatTimestamp(activity.timestamp || activity.createdAt),
            icon: getIconForActivityType(activity.type || 'info')
          }));

          setAlerts(mappedAlerts);
        } else {
          // Use default alerts if activity fetch fails
          setAlerts([
            {
              id: 1,
              status: 'success',
              title: 'System is operational',
              timestamp: 'Just now',
              icon: CheckCircle
            }
          ]);
        }

      } catch (error) {
        console.error('Error loading site overview data:', error);
        setError(error.message || 'Failed to load overview data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Helper function to get icon for activity type
  const getIconForActivityType = (type) => {
    const iconMap = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: AlertCircle,
      analyze: Activity,
      improve: Zap,
      plan: TrendingUp
    };
    return iconMap[type] || AlertCircle;
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 py-12 px-4 relative overflow-hidden">
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
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
              <Server className="w-10 h-10 text-sky-500" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Site Overview
            </h1>
          </motion.div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            System health, performance, and usage analytics at a glance
          </p>
        </motion.div>

        {/* System Metrics Panel */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-500" />
            System Metrics
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : systemStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SystemStatsCard
                icon={Users}
                title="Total Users"
                value={systemStats.totalUsers}
                subtitle="Registered accounts"
                color="from-sky-400 to-blue-500"
                delay={0}
              />
              <SystemStatsCard
                icon={Zap}
                title="API Requests"
                value={systemStats.totalApiRequests}
                subtitle="Total requests processed"
                color="from-purple-400 to-purple-600"
                delay={0.1}
              />
              <SystemStatsCard
                icon={Activity}
                title="System Uptime"
                value={systemStats.uptime}
                subtitle="%"
                color="from-emerald-400 to-emerald-600"
                delay={0.2}
                decimals={1}
              />
              <SystemStatsCard
                icon={Clock}
                title="Active Sessions"
                value={systemStats.activeSessions}
                subtitle="Currently online"
                color="from-amber-400 to-orange-500"
                delay={0.3}
              />
            </div>
          ) : (
            <div className="text-center text-red-700 p-4 bg-red-50 rounded-2xl border border-red-200 font-medium">
              Failed to load system metrics
            </div>
          )}
        </motion.div>

        {/* Usage Graphs Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-sky-500" />
            Usage Analytics
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LoadingSkeleton className="h-96" />
              <LoadingSkeleton className="h-96" />
            </div>
          ) : usageMetrics && usageMetrics.apiRequests?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel
                title="API Requests per Day"
                data={usageMetrics.apiRequests}
                dataKey="requests"
                color="#0ea5e9"
                delay={0}
                type="area"
              />
              <ChartPanel
                title="Active Users Trend"
                data={usageMetrics.activeUsers}
                dataKey="users"
                color="#8b5cf6"
                delay={0.1}
                type="line"
              />
            </div>
          ) : (
            <div className="bg-sky-50 rounded-2xl p-8 text-center border border-sky-200">
              <TrendingUp className="w-12 h-12 text-sky-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No usage data available yet</p>
            </div>
          )}
        </motion.div>

        {/* Health & Notifications Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-sky-500" />
            System Alerts & Activity
          </h2>
          {loading ? (
            <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-sky-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : alerts && alerts.length > 0 ? (
            <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <AlertCard key={alert.id} alert={alert} delay={index * 0.1} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">All systems operational</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SiteOverview;