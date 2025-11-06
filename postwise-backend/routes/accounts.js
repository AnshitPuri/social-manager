import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

/**
 * GET /api/accounts
 * Get all connected social accounts for user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const accountsSnapshot = await db
      .collection('social_accounts')
      .where('userId', '==', uid)
      .get();
    
    const accounts = accountsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: accounts
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

/**
 * POST /api/accounts/connect
 * Connect a new social media account
 * Body: { platform, username, accessToken, etc. }
 */
router.post('/connect', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { platform, username, accessToken } = req.body;

    if (!platform || !username) {
      return res.status(400).json({ error: 'Platform and username are required' });
    }

    console.log(`🔗 Connecting ${platform} account for user: ${email}`);

    // ============================================
    // SAVE TO FIRESTORE
    // ============================================
    const accountData = {
      userId: uid,
      platform,
      username,
      accessToken: accessToken || null, // Store securely in production
      followers: Math.floor(Math.random() * 10000), // Placeholder
      engagement: Math.floor(Math.random() * 100) / 10, // Placeholder
      profilePic: null,
      isConnected: true,
      connectedAt: new Date(),
      createdAt: new Date()
    };

    const docRef = await db.collection('social_accounts').add(accountData);

    res.json({
      success: true,
      message: `${platform} account connected successfully`,
      data: {
        id: docRef.id,
        ...accountData
      }
    });

  } catch (error) {
    console.error('Error connecting account:', error);
    res.status(500).json({ error: 'Failed to connect account' });
  }
});

/**
 * DELETE /api/accounts/:accountId
 * Disconnect a social media account
 */
router.delete('/:accountId', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { accountId } = req.params;

    // Verify ownership
    const accountDoc = await db.collection('social_accounts').doc(accountId).get();
    
    if (!accountDoc.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (accountDoc.data().userId !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete account
    await db.collection('social_accounts').doc(accountId).delete();

    res.json({
      success: true,
      message: 'Account disconnected successfully'
    });

  } catch (error) {
    console.error('Error disconnecting account:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
});

export default router;