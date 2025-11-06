import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the authenticated user
 */
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;

    console.log(`📊 Fetching dashboard stats for user: ${uid}`);

    // ============================================
    // FETCH USER DATA FROM FIRESTORE
    // ============================================
    
    // Get connected accounts
    const accountsSnapshot = await db
      .collection('social_accounts')
      .where('userId', '==', uid)
      .get();
    
    const accounts = accountsSnapshot.docs.map(doc => doc.data());
    
    // Get analyses count
    const analysesSnapshot = await db
      .collection('analyses')
      .where('userId', '==', uid)
      .get();
    
    // Calculate stats
    const totalAccounts = accounts.length;
    const totalFollowers = accounts.reduce((sum, acc) => sum + (acc.followers || 0), 0);
    const avgEngagement = accounts.length > 0
      ? (accounts.reduce((sum, acc) => sum + (acc.engagement || 0), 0) / accounts.length).toFixed(2)
      : 0;
    const postsAnalyzed = analysesSnapshot.size;

    // ============================================
    // RESPONSE DATA
    // ============================================
    const stats = {
      totalAccounts,
      totalFollowers,
      avgEngagement: parseFloat(avgEngagement),
      postsAnalyzed,
      accounts: accounts.map(acc => ({
        platform: acc.platform,
        username: acc.username,
        followers: acc.followers || 0,
        engagement: acc.engagement || 0,
        profilePic: acc.profilePic || null,
        isConnected: true
      })),
      recentActivity: await getRecentActivity(uid)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getRecentActivity(userId) {
  try {
    const activitiesSnapshot = await db
      .collection('activities')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    return activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export default router;