import { auth } from '../firebase/config'; // Firebase config

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===================================================
// Helper: Safe Token Fetch with Refresh
// ===================================================
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null; // handled gracefully below
  }

  // Force refresh token for reliability
  try {
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

// ===================================================
// Helper: Fetch with Timeout (prevents hanging requests)
// ===================================================
const fetchWithTimeout = (url, options, timeout = 15000) =>
  Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);

// ===================================================
// Unified API Call Helper
// ===================================================
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({})); // prevent crash on invalid JSON

    if (!response.ok) {
      return { success: false, error: data.error || 'API request failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
};

// ===================================================
// API METHODS
// ===================================================
export const api = {
  // Analyze Post
  analyzePost: async (content) =>
    apiCall('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Improve Post
  improvePost: async (content, tone = 'professional') =>
    apiCall('/api/improve', {
      method: 'POST',
      body: JSON.stringify({ content, tone }),
    }),

  // Generate Content Plan
  generatePlan: async (niche, platform = 'all') =>
    apiCall('/api/plan', {
      method: 'POST',
      body: JSON.stringify({ niche, platform }),
    }),

  // Get Dashboard Stats
  getDashboardStats: async () =>
    apiCall('/api/dashboard/stats', { method: 'GET' }),

  // Get Connected Accounts
  getAccounts: async () =>
    apiCall('/api/accounts', { method: 'GET' }),

  // Connect Social Account
  connectAccount: async (platform, username, accessToken = null) =>
    apiCall('/api/accounts/connect', {
      method: 'POST',
      body: JSON.stringify({ platform, username, accessToken }),
    }),

  // Disconnect Account
  disconnectAccount: async (accountId) =>
    apiCall(`/api/accounts/${accountId}`, { method: 'DELETE' }),

  // Get Analytics
  getAnalytics: async (timeRange = '30d') =>
    apiCall(`/api/analytics?timeRange=${timeRange}`, { method: 'GET' }),

  // Get Overview
  getOverview: async () =>
    apiCall('/api/overview', { method: 'GET' }),

  // Get Activity Feed
  getActivity: async (limit = 20) =>
    apiCall(`/api/overview/activity?limit=${limit}`, { method: 'GET' }),
};

export default api;
