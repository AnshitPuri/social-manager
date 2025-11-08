import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { niche, platform = 'all' } = req.body;
    const { uid, email } = req.user;

    if (!niche || niche.trim().length === 0) {
      return res.status(400).json({ error: 'Niche is required' });
    }

    console.log(`💡 Generating content ideas for niche: ${niche}`);
    
    const ideas = generateContentIdeas(niche, platform);


    await db.collection('content_plans').add({
      userId: uid,
      niche,
      platform,
      ideas,
      createdAt: new Date()
    });

    res.json({
      success: true,
      data: {
        niche,
        platform,
        ideas,
        generated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating content ideas:', error);
    res.status(500).json({ error: 'Failed to generate content ideas' });
  }
});


function generateContentIdeas(niche, platform) {
  const times = ['9:00 AM', '1:00 PM', '5:00 PM', '8:00 PM'];
  const platforms = platform === 'all' 
    ? ['Instagram', 'Twitter', 'LinkedIn', 'Facebook']
    : [platform];

  const ideas = [];
  
  for (let i = 1; i <= 5; i++) {
    ideas.push({
      id: i,
      title: `${niche} Idea #${i}`,
      caption: `Engaging post about ${niche}. This is your ${i}th idea to boost your ${niche} content strategy! 🚀`,
      bestTime: times[Math.floor(Math.random() * times.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      hashtags: [`#${niche.replace(/\s+/g, '')}`, '#ContentCreator', '#SocialMedia'],
      estimatedEngagement: Math.floor(Math.random() * 100) + 50
    });
  }
  
  return ideas;
}

export default router;