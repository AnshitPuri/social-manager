import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

/**
 * GET /api/overview
 * Get system-wide overview and statistics
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;

    console.log(`📊 Fetching overview for user: ${email}`);

    // ============================================
    // FETCH AGGREGATED DATA
    // ============================================
    
    // Total posts analyzed
    const analysesSnapshot = await db
      .collection('analyses')
      .where('userId', '==', uid)
      .get();
    
    // Total content improvements generated
    const improvementsSnapshot = await db
      .collection('improvements')
      .where('userId', '==', uid)
      .get();
    
    // Total content plans created
    const plansSnapshot = await db
      .collection('content_plans')
      .where('userId', '==', uid)
      .get();
    
    // Connected accounts
    const accountsSnapshot = await db
      .collection('social_accounts')
      .where('userId', '==', uid)
      .get();

    // ============================================
    // CALCULATE STATS
    // ============================================
    const overview = {
      totalAnalyses: analysesSnapshot.size,
      totalImprovements: improvementsSnapshot.size,
      totalPlans: plansSnapshot.size,
      connectedAccounts: accountsSnapshot.size,
      recentAnalyses: analysesSnapshot.docs.slice(0, 5).map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toISOString()
      })),
      accountsSummary: accountsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          platform: data.platform,
          username: data.username,
          followers: data.followers || 0,
          engagement: data.engagement || 0
        };
      }),
      usageStats: {
        thisWeek: {
          analyses: Math.floor(analysesSnapshot.size * 0.3),
          improvements: Math.floor(improvementsSnapshot.size * 0.3),
          plans: Math.floor(plansSnapshot.size * 0.3)
        },
        thisMonth: {
          analyses: analysesSnapshot.size,
          improvements: improvementsSnapshot.size,
          plans: plansSnapshot.size
        }
      }
    };

    res.json({
      success: true,
      data: overview
    });

  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

/**
 * GET /api/overview/activity
 * Get recent activity timeline
 */
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit = 20 } = req.query;

    // Fetch recent activities from multiple collections
    const activities = [];

    // Get recent analyses
    const analysesSnapshot = await db
      .collection('analyses')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    analysesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        type: 'analysis',
        action: 'analyzed a post',
        timestamp: data.createdAt.toDate().toISOString(),
        details: {
          wordCount: data.result.wordCount,
          sentiment: data.result.sentiment
        }
      });
    });

    // Get recent improvements
    const improvementsSnapshot = await db
      .collection('improvements')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    improvementsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        type: 'improvement',
        action: 'generated improved captions',
        timestamp: data.createdAt.toDate().toISOString(),
        details: {
          tone: data.tone,
          versions: data.improvedVersions.length
        }
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: activities.slice(0, parseInt(limit))
    });

  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;