import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Wand2, Calendar, PieChart, LayoutDashboard, Home, LogIn } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: BarChart3 },
    { id: 'improve', label: 'Improve', icon: Wand2 },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'overview', label: 'Site Overview' },
    { id: 'login', label: 'Login', icon: LogIn }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sky-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-8 h-8 text-sky-500" />
            </motion.div>
            <span className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              PostWise AI
            </span>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-sky-50/50 backdrop-blur-sm rounded-2xl p-1.5 border border-sky-200/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-slate-600 hover:text-sky-600'
                  }`}
                  whileHover={{ scale: isActive ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                  
                  {/* Icon and Label */}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated underline */}
      <motion.div
        className="h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </nav>
  );
}