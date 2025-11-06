// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Lock, Bell, Globe, Palette, Shield, 
    Trash2, Camera, Save, X, Check, Eye, EyeOff, Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { 
    updateProfile, 
    updatePassword, 
    EmailAuthProvider, 
    reauthenticateWithCredential,
    deleteUser 
} from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile Settings State
    const [profileData, setProfileData] = useState({
        displayName: '',
        email: '',
        phone: '',
        bio: '',
        photoURL: ''
    });

    // Password Settings State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Notification Settings State
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        analyticsReports: true,
        weeklyDigest: false,
        productUpdates: true
    });

    // Appearance Settings State
    const [appearance, setAppearance] = useState({
        theme: 'light',
        language: 'en',
        timezone: 'UTC'
    });

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'danger', label: 'Danger Zone', icon: Trash2 }
    ];

    // ============================================
    // LOAD USER DATA FROM FIRESTORE
    // ============================================
    useEffect(() => {
        const loadUserData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setProfileData({
                        displayName: userData.name || user.displayName || '',
                        email: user.email || '',
                        phone: userData.phone || '',
                        bio: userData.bio || '',
                        photoURL: userData.photoURL || user.photoURL || ''
                    });
                    setNotifications(userData.notifications || notifications);
                    setAppearance(userData.appearance || appearance);
                } else {
                    // Use Firebase Auth data if Firestore doc doesn't exist
                    setProfileData({
                        displayName: user.displayName || '',
                        email: user.email || '',
                        phone: '',
                        bio: '',
                        photoURL: user.photoURL || ''
                    });
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                showMessage('error', 'Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [user]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // ============================================
    // SAVE PROFILE TO FIRESTORE + FIREBASE AUTH
    // ============================================
    const handleProfileSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            // Update Firebase Auth profile
            await updateProfile(auth.currentUser, {
                displayName: profileData.displayName,
                photoURL: profileData.photoURL
            });

            // Update Firestore user document
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                name: profileData.displayName,
                phone: profileData.phone,
                bio: profileData.bio,
                photoURL: profileData.photoURL,
                updatedAt: new Date()
            });

            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // CHANGE PASSWORD
    // ============================================
    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'Passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            // Re-authenticate user before password change
            const credential = EmailAuthProvider.credential(
                user.email,
                passwordData.currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Update password
            await updatePassword(auth.currentUser, passwordData.newPassword);

            showMessage('success', 'Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            if (error.code === 'auth/wrong-password') {
                showMessage('error', 'Current password is incorrect');
            } else {
                showMessage('error', error.message || 'Failed to update password');
            }
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // SAVE NOTIFICATION PREFERENCES
    // ============================================
    const handleNotificationsSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                notifications,
                updatedAt: new Date()
            });

            showMessage('success', 'Notification preferences updated!');
        } catch (error) {
            console.error('Error updating notifications:', error);
            showMessage('error', 'Failed to update notifications');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // SAVE APPEARANCE SETTINGS
    // ============================================
    const handleAppearanceSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                appearance,
                updatedAt: new Date()
            });

            showMessage('success', 'Appearance settings updated!');
        } catch (error) {
            console.error('Error updating appearance:', error);
            showMessage('error', 'Failed to update appearance');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // DELETE ACCOUNT
    // ============================================
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            '⚠️ Are you ABSOLUTELY sure?\n\n' +
            'This will permanently delete:\n' +
            '• Your account\n' +
            '• All your data\n' +
            '• All connected social accounts\n' +
            '• All analytics history\n\n' +
            'This action CANNOT be undone!'
        );

        if (!confirmed) return;

        const password = window.prompt('Enter your password to confirm deletion:');
        if (!password) return;

        setSaving(true);
        try {
            // Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Delete Firestore data
            const userRef = doc(db, 'users', user.uid);
            await deleteDoc(userRef);

            // Delete Firebase Auth account
            await deleteUser(auth.currentUser);

            showMessage('success', 'Account deleted successfully');
            // User will be automatically redirected by auth state change
        } catch (error) {
            console.error('Error deleting account:', error);
            if (error.code === 'auth/wrong-password') {
                showMessage('error', 'Incorrect password');
            } else {
                showMessage('error', error.message || 'Failed to delete account');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Account Settings
                    </h1>
                    <p className="text-gray-600">Manage your account preferences and settings</p>
                </motion.div>

                {/* Message Toast */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                        }`}
                    >
                        {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-64 bg-white rounded-2xl shadow-lg p-4 h-fit"
                    >
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                                        activeSection === section.id
                                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-sky-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{section.label}</span>
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 bg-white rounded-2xl shadow-lg p-8"
                    >
                        {/* Profile Section */}
                        {activeSection === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
                                
                                {/* Profile Photo */}
                                <div className="mb-8 flex items-center gap-6">
                                    <div className="relative">
                                        {profileData.photoURL ? (
                                            <img
                                                src={profileData.photoURL}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full border-4 border-sky-200 object-cover"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                                {profileData.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <button className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors shadow-lg">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Profile Photo</h3>
                                        <p className="text-sm text-gray-500 mb-2">PNG, JPG up to 5MB</p>
                                        <input
                                            type="text"
                                            placeholder="Enter image URL"
                                            value={profileData.photoURL}
                                            onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                                            className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.displayName}
                                            onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleProfileSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Section */}
                        {activeSection === 'security' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-12"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-12"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-12"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className="mt-8 p-6 bg-sky-50 rounded-xl border border-sky-200">
                                    <h3 className="font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                                    <button className="px-4 py-2 bg-white text-sky-600 border border-sky-600 rounded-lg font-medium hover:bg-sky-50 transition-colors">
                                        Enable 2FA (Coming Soon)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === 'notifications' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                                
                                <div className="space-y-4">
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-800 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} updates
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({...notifications, [key]: !value})}
                                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                                                    value ? 'bg-sky-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                                        value ? 'translate-x-7' : ''
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNotificationsSave}
                                    disabled={saving}
                                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {saving ? 'Saving...' : 'Save Preferences'}
                                </button>
                            </div>
                        )}

                        {/* Appearance Section */}
                        {activeSection === 'appearance' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Appearance Settings</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Theme
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['light', 'dark', 'auto'].map((theme) => (
                                                <button
                                                    key={theme}
                                                    onClick={() => setAppearance({...appearance, theme})}
                                                    className={`p-4 border-2 rounded-xl capitalize transition-all ${
                                                        appearance.theme === theme
                                                            ? 'border-sky-500 bg-sky-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {theme}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                value={appearance.language}
                                                onChange={(e) => setAppearance({...appearance, language: e.target.value})}
                                                className="w-full appearance-none px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            >
                                                <option value="en">English (US)</option>
                                                <option value="es">Spanish</option>
                                                <option value="fr">French</option>
                                                <option value="de">German</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Timezone
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={appearance.timezone}
                                                onChange={(e) => setAppearance({...appearance, timezone: e.target.value})}
                                                className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            >
                                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                                                <option value="EST">EST (Eastern Standard Time)</option>
                                                <option value="PST">PST (Pacific Standard Time)</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleAppearanceSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {saving ? 'Saving...' : 'Save Appearance'}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Privacy Section - ADDED */}
                        {activeSection === 'privacy' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</h2>
                                
                                <div className="space-y-6">
                                    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Data Sharing</h3>
                                        <p className="text-gray-600 mb-4">Control how your data is used for service improvements and personalized content.</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Share usage data for analytics</span>
                                            <button
                                                // Placeholder for toggle logic
                                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                                                    false ? 'bg-sky-500' : 'bg-gray-300' // Example: default to false
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                                        false ? 'translate-x-7' : ''
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Turning this off may limit personalized features.</p>
                                    </div>
                                    
                                    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2">Legal Documents</h3>
                                        <p className="text-gray-600 mb-4">Review our terms of service and privacy policy.</p>
                                        <div className="flex gap-4">
                                            <a href="#" className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1">
                                                <Check className="w-4 h-4" /> Terms of Service
                                            </a>
                                            <a href="#" className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1">
                                                <Shield className="w-4 h-4" /> Privacy Policy
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <button
                                        // Placeholder for Privacy Save button
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Privacy
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Danger Zone Section - ADDED */}
                        {activeSection === 'danger' && (
                            <div>
                                <h2 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h2>
                                
                                <div className="p-6 bg-red-50 border-2 border-red-300 rounded-xl space-y-4">
                                    <h3 className="font-bold text-xl text-red-700 flex items-center gap-2">
                                        <Trash2 className="w-6 h-6" /> Permanently Delete Account
                                    </h3>
                                    <p className="text-red-600">
                                        This action is **irreversible**. All your data, settings, and profile information will be immediately and permanently deleted. You will be signed out and unable to recover your account.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        {saving ? 'Deleting...' : 'Delete Account Forever'}
                                    </button>
                                </div>
                                
                                <div className="mt-6 p-6 bg-yellow-50 border border-yellow-300 rounded-xl">
                                    <h3 className="font-semibold text-lg text-yellow-800">Transfer Ownership (Coming Soon)</h3>
                                    <p className="text-sm text-yellow-700 mt-2">
                                        Transfer account ownership to another user before deleting or if you are leaving the team.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}