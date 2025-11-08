// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/Home';
import Navbar from './components/Navbar';
import AnalyzePage from './pages/AnalyzePage';
import ImprovePage from './pages/ImprovePage';
import PlanPage from './pages/PlanPage';
import DashboardPage from './pages/DashboardPage';
import ConnectAccountsPage from './pages/ConnectAccountsPage';
import SiteOverviewPage from './pages/SiteOverviewPage';
import SettingsPage from './pages/Settings';
import ContentRecyclingMachine from './pages/ContentRecyclingMachine';
import CrisisManagementAI from './pages/CrisisManagementAI';
import TrendHijackingPage from './pages/TrendHijackingPage';


// Main authenticated app content
function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeTab with URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/settings') {
      setActiveTab('settings');
    } else if (path === '/recycle') {
      setActiveTab('recycle');
    } else if (path === '/crisis') {
      setActiveTab('crisis');
    } else if (path === '/trends') {
      setActiveTab('trends');
    } else if (path === '/dashboard') {
      setActiveTab('dashboard');
    } else if (path === '/analyze') {
      setActiveTab('analyze');
    } else if (path === '/improve') {
      setActiveTab('improve');
    } else if (path === '/plan') {
      setActiveTab('plan');
    } else if (path === '/connect') {
      setActiveTab('connect');
    } else if (path === '/overview') {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Handle tab changes from Navbar
  const handleTabChange = (tab) => {
    // Navigate based on tab
    const routes = {
      settings: '/settings',
      recycle: '/recycle',
      crisis: '/crisis',
      trends: '/trends',
      dashboard: '/dashboard',
      analyze: '/analyze',
      improve: '/improve',
      plan: '/plan',
      connect: '/connect',
      overview: '/overview'
    };
    
    if (routes[tab]) {
      navigate(routes[tab]);
    }
  };

  // Render based on current route
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {/* Render the appropriate page based on activeTab */}
      {activeTab === 'settings' && <SettingsPage />}
      {activeTab === 'recycle' && <ContentRecyclingMachine />}
      {activeTab === 'crisis' && <CrisisManagementAI />}
      {activeTab === 'trends' && <TrendHijackingPage />}
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'analyze' && <AnalyzePage />}
      {activeTab === 'improve' && <ImprovePage />}
      {activeTab === 'plan' && <PlanPage />}
      {activeTab === 'connect' && <ConnectAccountsPage />}
      {activeTab === 'overview' && <SiteOverviewPage />}
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-sky-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public route wrapper
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-sky-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => console.log('✅ Backend connected:', data))
      .catch(err => console.error('❌ Backend connection failed:', err));
  }, []); 

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* All Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/recycle" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/crisis" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/trends" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/analyze" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/improve" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/connect" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
          <Route path="/overview" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;