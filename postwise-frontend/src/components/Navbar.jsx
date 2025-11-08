import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, Wand2, Calendar, LayoutDashboard, LogIn, Settings, LogOut, Home, Link2, Recycle, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    // Define tabs
    const authenticatedTabs = [
        { id: 'overview', label: 'Admin', icon: Home },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analyze', label: 'Analyze', icon: BarChart3 },
        { id: 'improve', label: 'Improve', icon: Wand2 },
        { id: 'plan', label: 'Plan', icon: Calendar },
        { id: 'recycle', label: 'Recycle', icon: Recycle },
        { id: 'crisis', label: 'Crisis', icon: AlertTriangle },
        { id: 'trends', label: 'Trends', icon: TrendingUp },
        { id: 'connect', label: 'Connect', icon: Link2 },
    ];

    const publicTabs = [
        { id: 'overview', label: 'Home', icon: Home },
    ];

    const tabs = user ? authenticatedTabs : publicTabs;

    const handleLogout = async () => {
        try {
            await logout();
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
    };

    const handleLogoClick = () => {
        setActiveTab('overview');
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
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo */}
                    <button
                        onClick={handleLogoClick}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Sparkles className="w-6 h-6 text-sky-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                            PostWise AI
                        </span>
                    </button>

                    {/* Navigation & Auth */}
                    <div className="flex items-center gap-8"> 
                        
                        {/* Navigation Tabs */}
                        <div className="hidden lg:flex items-center gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab)}
                                        className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                                            isActive 
                                                ? 'text-white bg-sky-500' 
                                                : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Auth Section */}
                        {user ? (
                            // User Menu
                            <div className="relative user-menu-container">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {/* Avatar */}
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-sky-300"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/32x32/B3E5FC/0288D1?text=U" }}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                    
                                    {/* Dropdown Arrow */}
                                    <ChevronDown 
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                            showUserMenu ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {user?.displayName || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            
                                            {/* Menu Items */}
                                            <div className="py-1">
                                                <button
                                                    onClick={() => { 
                                                        setActiveTab('settings');
                                                        setShowUserMenu(false); 
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 text-gray-400" />
                                                    Settings
                                                </button>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            // Login Button
                            <button
                                onClick={handleLoginClick}
                                className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium text-sm transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}