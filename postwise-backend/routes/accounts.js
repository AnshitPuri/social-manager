import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();


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


router.post('/connect', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { platform, username, accessToken } = req.body;

    if (!platform || !username) {
      return res.status(400).json({ error: 'Platform and username are required' });
    }

    console.log(`🔗 Connecting ${platform} account for user: ${email}`);

  
    const accountData = {
      userId: uid,
      platform,
      username,
      accessToken: accessToken || null,
      followers: Math.floor(Math.random() * 10000),
      engagement: Math.floor(Math.random() * 100) / 10, 
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


router.delete('/:accountId', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { accountId } = req.params;


    const accountDoc = await db.collection('social_accounts').doc(accountId).get();
    
    if (!accountDoc.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (accountDoc.data().userId !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

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