import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { timeRange = '30d' } = req.query;

    console.log(`📈 Fetching analytics for user: ${uid}`);

    const analytics = {
      followerGrowth: generateFollowerGrowth(timeRange),
      engagementOverTime: generateEngagementData(timeRange),
      platformComparison: await getPlatformComparison(uid),
      topPosts: await getTopPosts(uid),
      demographics: {
        ageGroups: [
          { age: '18-24', percentage: 25 },
          { age: '25-34', percentage: 35 },
          { age: '35-44', percentage: 20 },
          { age: '45+', percentage: 20 }
        ],
        locations: [
          { country: 'United States', percentage: 40 },
          { country: 'United Kingdom', percentage: 20 },
          { country: 'Canada', percentage: 15 },
          { country: 'India', percentage: 25 }
        ]
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

function generateFollowerGrowth(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const data = [];
  let followers = 1000;
  
  for (let i = 0; i < days; i++) {
    followers += Math.floor(Math.random() * 50) - 10;
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toISOString().split('T')[0],
      followers: Math.max(0, followers)
    });
  }
  
  return data;
}

function generateEngagementData(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toISOString().split('T')[0],
      likes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 100) + 20,
      shares: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return data;
}

async function getPlatformComparison(userId) {
  try {
    const accountsSnapshot = await db
      .collection('social_accounts')
      .where('userId', '==', userId)
      .get();
    
    return accountsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        platform: data.platform,
        followers: data.followers || 0,
        engagement: data.engagement || 0,
        posts: Math.floor(Math.random() * 100) + 20
      };
    });
  } catch (error) {
    console.error('Error getting platform comparison:', error);
    return [];
  }
}

async function getTopPosts(userId) {
  try {
    const postsSnapshot = await db
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('engagement', 'desc')
      .limit(5)
      .get();
    
    return postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting top posts:', error);
    return [];
  }
}

export default router;