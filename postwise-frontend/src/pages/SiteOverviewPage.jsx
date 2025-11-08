import React, { useState, useEffect } from 'react';
import { Activity, Users, Zap, Clock, TrendingUp, Server, AlertCircle, CheckCircle, AlertTriangle, Database, Cpu, HardDrive, Globe } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  <div
    className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md hover:shadow-lg transition-all duration-300"
    style={{
      animation: `fadeInUp 0.6s ease-out ${delay}s both`
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-700 font-semibold text-lg">{title}</span>
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-4xl font-bold text-sky-600 mb-1">
      <AnimatedCounter value={value} decimals={decimals} />
      {subtitle === '%' && '%'}
    </div>
    <div className="text-slate-600 text-sm font-medium">
      {subtitle !== '%' && subtitle}
    </div>
  </div>
);

// Chart Panel Component
const ChartPanel = ({ title, data, dataKey, color, delay, type = 'line', yAxisLabel = '' }) => (
  <div
    className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md hover:shadow-lg transition-all duration-300"
    style={{
      animation: `fadeInUp 0.6s ease-out ${delay}s both`
    }}
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
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
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
        ) : type === 'bar' ? (
          <BarChart data={data}>
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
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
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
  </div>
);

// Pie Chart Component
const PieChartPanel = ({ title, data, delay }) => {
  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div
      className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md hover:shadow-lg transition-all duration-300"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`
      }}
    >
      <h3 className="text-slate-700 font-bold text-xl mb-6 flex items-center gap-2">
        <Database className="w-5 h-5 text-sky-500" />
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

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
    <div
      className={`${style.bg} border-2 ${style.border} rounded-xl p-4 flex items-start gap-3 hover:scale-105 transition-transform duration-200`}
      style={{
        animation: `slideInLeft 0.4s ease-out ${delay}s both`
      }}
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
    </div>
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
const SiteOverviewPage = () => {
  const [systemStats, setSystemStats] = useState(null);
  const [usageMetrics, setUsageMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const loadData = () => {
      setLoading(true);
      
      setTimeout(() => {
        // Hardcoded system stats
        setSystemStats({
          totalUsers: 15847,
          totalApiRequests: 2456789,
          uptime: 99.8,
          activeSessions: 1234,
          cpuUsage: 45.7,
          memoryUsage: 68.3,
          diskUsage: 52.1,
          bandwidth: 847
        });

        // Hardcoded usage metrics with more diverse data
        setUsageMetrics({
          apiRequests: [
            { day: 'Mon', requests: 45000 },
            { day: 'Tue', requests: 52000 },
            { day: 'Wed', requests: 49000 },
            { day: 'Thu', requests: 63000 },
            { day: 'Fri', requests: 58000 },
            { day: 'Sat', requests: 42000 },
            { day: 'Sun', requests: 38000 }
          ],
          activeUsers: [
            { day: 'Mon', users: 1250 },
            { day: 'Tue', users: 1420 },
            { day: 'Wed', users: 1380 },
            { day: 'Thu', users: 1650 },
            { day: 'Fri', users: 1590 },
            { day: 'Sat', users: 980 },
            { day: 'Sun', users: 850 }
          ],
          responseTime: [
            { day: 'Mon', time: 145 },
            { day: 'Tue', time: 132 },
            { day: 'Wed', time: 128 },
            { day: 'Thu', time: 156 },
            { day: 'Fri', time: 142 },
            { day: 'Sat', time: 118 },
            { day: 'Sun', time: 115 }
          ],
          errorRate: [
            { day: 'Mon', rate: 0.8 },
            { day: 'Tue', rate: 0.6 },
            { day: 'Wed', rate: 0.5 },
            { day: 'Thu', rate: 1.2 },
            { day: 'Fri', rate: 0.7 },
            { day: 'Sat', rate: 0.4 },
            { day: 'Sun', rate: 0.3 }
          ],
          trafficSources: [
            { name: 'Direct', value: 35 },
            { name: 'Search', value: 28 },
            { name: 'Social', value: 18 },
            { name: 'Referral', value: 12 },
            { name: 'Email', value: 7 }
          ],
          dataTransfer: [
            { day: 'Mon', upload: 234, download: 567 },
            { day: 'Tue', upload: 287, download: 623 },
            { day: 'Wed', upload: 256, download: 589 },
            { day: 'Thu', upload: 312, download: 698 },
            { day: 'Fri', upload: 289, download: 645 },
            { day: 'Sat', upload: 198, download: 456 },
            { day: 'Sun', upload: 176, download: 412 }
          ]
        });

        // Hardcoded alerts
        setAlerts([
          {
            id: 1,
            status: 'success',
            title: 'System backup completed successfully',
            timestamp: '5 minutes ago',
            icon: CheckCircle
          },
          {
            id: 2,
            status: 'info',
            title: 'Database optimization scheduled for 2:00 AM',
            timestamp: '1 hour ago',
            icon: Database
          },
          {
            id: 3,
            status: 'warning',
            title: 'High memory usage detected on server-03',
            timestamp: '2 hours ago',
            icon: AlertTriangle
          },
          {
            id: 4,
            status: 'success',
            title: 'Security patch applied to all servers',
            timestamp: '3 hours ago',
            icon: CheckCircle
          },
          {
            id: 5,
            status: 'info',
            title: 'New user registration: 234 users today',
            timestamp: '4 hours ago',
            icon: Users
          },
          {
            id: 6,
            status: 'success',
            title: 'API rate limit increased to 10,000 req/hour',
            timestamp: '6 hours ago',
            icon: Zap
          }
        ]);

        setLoading(false);
      }, 1500);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 py-12 px-4 relative overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{ animation: 'float 20s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{ animation: 'float 25s ease-in-out infinite', animationDelay: '2s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12" style={{ animation: 'fadeInUp 0.6s ease-out both' }}>
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
              <Server className="w-10 h-10 text-sky-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Site Overview
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            System health, performance, and usage analytics at a glance
          </p>
        </div>

        {/* System Metrics Panel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-500" />
            System Metrics
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : systemStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
          ) : null}
          
          {/* Additional System Stats */}
          {!loading && systemStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SystemStatsCard
                icon={Cpu}
                title="CPU Usage"
                value={systemStats.cpuUsage}
                subtitle="%"
                color="from-blue-400 to-indigo-500"
                delay={0.4}
                decimals={1}
              />
              <SystemStatsCard
                icon={HardDrive}
                title="Memory Usage"
                value={systemStats.memoryUsage}
                subtitle="%"
                color="from-violet-400 to-purple-600"
                delay={0.5}
                decimals={1}
              />
              <SystemStatsCard
                icon={Database}
                title="Disk Usage"
                value={systemStats.diskUsage}
                subtitle="%"
                color="from-pink-400 to-rose-500"
                delay={0.6}
                decimals={1}
              />
              <SystemStatsCard
                icon={Globe}
                title="Bandwidth"
                value={systemStats.bandwidth}
                subtitle="GB transferred today"
                color="from-teal-400 to-cyan-600"
                delay={0.7}
              />
            </div>
          )}
        </div>

        {/* Usage Graphs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-sky-500" />
            Usage Analytics
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LoadingSkeleton className="h-96" />
              <LoadingSkeleton className="h-96" />
            </div>
          ) : usageMetrics ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartPanel
                  title="Response Time (ms)"
                  data={usageMetrics.responseTime}
                  dataKey="time"
                  color="#10b981"
                  delay={0.2}
                  type="line"
                />
                <ChartPanel
                  title="Error Rate (%)"
                  data={usageMetrics.errorRate}
                  dataKey="rate"
                  color="#ef4444"
                  delay={0.3}
                  type="bar"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChartPanel
                  title="Traffic Sources"
                  data={usageMetrics.trafficSources}
                  delay={0.4}
                />
                <ChartPanel
                  title="Data Transfer (GB)"
                  data={usageMetrics.dataTransfer}
                  dataKey="download"
                  color="#f59e0b"
                  delay={0.5}
                  type="area"
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Health & Notifications Panel */}
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default SiteOverviewPage;