import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, Wand2, Calendar, LayoutDashboard, LogIn, Settings, LogOut, Home, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Sync activeTab with current location
    useEffect(() => {
        const path = location.pathname;
        if (path === '/dashboard') setActiveTab('dashboard');
        else if (path === '/analyze') setActiveTab('analyze');
        else if (path === '/improve') setActiveTab('improve');
        else if (path === '/plan') setActiveTab('plan');
        else if (path === '/connect') setActiveTab('connect');
        else if (path === '/overview' || path === '/') setActiveTab('overview');
        else if (path === '/settings') setActiveTab('settings');
    }, [location.pathname, setActiveTab]);

    // Define tabs based on authentication status
    const authenticatedTabs = [
        { id: 'overview', label: 'Admin Dash', icon: Home, path: '/overview' },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'analyze', label: 'Analyze', icon: BarChart3, path: '/analyze' },
        { id: 'improve', label: 'Improve', icon: Wand2, path: '/improve' },
        { id: 'plan', label: 'Plan', icon: Calendar, path: '/plan' },
        { id: 'connect', label: 'Connect', icon: LinkIcon, path: '/connect' },
    ];

    const publicTabs = [
        { id: 'overview', label: 'Home', icon: Home, path: '/' },
    ];

    const tabs = user ? authenticatedTabs : publicTabs;

    const handleLogout = async () => {
        try {
            await logout();
            setActiveTab('overview');
            navigate('/login');
            setShowUserMenu(false);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        navigate(tab.path);
    };

    const handleLogoClick = () => {
        if (user) {
            setActiveTab('overview');
            navigate('/overview');
        } else {
            setActiveTab('overview');
            navigate('/');
        }
    };

    const getUserInitials = () => {
        if (user?.displayName) {
            return user.displayName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || 'U';
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sky-200/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo - Animated & Gradient */}
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogoClick}
                    >
                        <motion.div
                            className="relative"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-8 h-8 text-sky-500" />
                        </motion.div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                            PostWise AI
                        </span>
                    </motion.div>

                    {/* Navigation Tabs (Flex container for Tabs and Auth Buttons) */}
                    <div className="flex items-center gap-4"> 
                        
                        {/* Navigation Tabs - Modern Animated Styling */}
                        <div className="hidden md:flex items-center gap-2 bg-sky-50/50 backdrop-blur-sm rounded-2xl p-1.5 border border-sky-200/50">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab)}
                                        className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm ${
                                            isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:text-sky-600'
                                        }`}
                                        whileHover={{ scale: isActive ? 1 : 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {/* Active Tab Background */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                                                layoutId="activeTab"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}

                                        {/* Icon and Label */}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {Icon && <Icon className="w-4 h-4" />}
                                            {tab.label}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                        
                        {/* Auth Section - Login Button or User Menu */}
                        {user ? (
                            // User Menu - Shown when authenticated
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 focus:outline-none p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    {/* User Avatar or Initials */}
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full border-2 border-sky-300"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/B3E5FC/0288D1?text=U" }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                    
                                    {/* Dropdown Arrow */}
                                    <svg
                                        className={`w-5 h-5 text-gray-600 transition-transform hidden sm:block ${
                                            showUserMenu ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 origin-top-right"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-900">
                                                {user?.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        
                                        {/* Settings Link */}
                                        <button
                                            onClick={() => { 
                                                navigate('/settings'); 
                                                setShowUserMenu(false); 
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-sky-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-sky-500" />
                                            Account Settings
                                        </button>

                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            // Login Button - Shown when not authenticated
                            <motion.button
                                onClick={handleLoginClick}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Animated underline across the bottom */}
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