// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ============================================
  // CREATE USER DOCUMENT IN FIRESTORE
  // ============================================
  const createUserDocument = async (user, displayName) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document already exists (for Google sign-in)
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          name: displayName || user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL || null,
          phone: '',
          bio: '',
          plan: 'free',
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            analyticsReports: true,
            weeklyDigest: false,
            productUpdates: true
          },
          appearance: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC'
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        console.log('✅ User document created in Firestore');
      } else {
        console.log('ℹ️ User document already exists');
      }
    } catch (error) {
      console.error('❌ Error creating user document:', error);
      throw error;
    }
  };

  // ============================================
  // EMAIL/PASSWORD SIGNUP
  // ============================================
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase Auth user created');
      
      // 2. Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: name.trim()
      });
      console.log('✅ User profile updated');

      // 3. Create user document in Firestore
      await createUserDocument(userCredential.user, name.trim());

      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Signup error:', err);
      
      // User-friendly error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 6 characters.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Check your internet connection.');
          break;
        default:
          setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GOOGLE SIGNUP
  // ============================================
  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      
      // Force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google sign-in successful');
      
      // Create user document in Firestore
      await createUserDocument(result.user);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Google signup error:', err);
      
      // User-friendly error messages
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-up cancelled');
          break;
        case 'auth/popup-blocked':
          setError('Popup blocked. Please allow popups for this site.');
          break;
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with this email using a different sign-in method.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Check your internet connection.');
          break;
        default:
          setError(err.message || 'Failed to sign up with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join PostWise AI and supercharge your content</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
          >
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border-2 border-gray-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </>
          )}
        </button>

        {/* Terms and Privacy */}
        <p className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <a href="#" className="text-sky-600 hover:text-sky-700 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-sky-600 hover:text-sky-700 font-medium">
            Privacy Policy
          </a>
        </p>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;