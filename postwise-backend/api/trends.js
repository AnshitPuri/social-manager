import express from 'express';
import axios from 'axios';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper function to fetch Twitter trends
async function fetchTwitterTrends(niche) {
  try {
    // Mock Twitter trends (replace with actual Twitter API call)
    return {
      hashtags: [
        { tag: '#DigitalMarketing2025', posts: 125000, velocity: 'viral', growth: '+245%', platform: 'twitter' },
        { tag: '#ContentStrategy', posts: 89000, velocity: 'hot', growth: '+180%', platform: 'twitter' },
        { tag: '#SocialMediaTips', posts: 67000, velocity: 'trending', growth: '+95%', platform: 'twitter' }
      ],
      topics: [
        { topic: 'AI Content Creation Tools', discussions: 45000, velocity: 'viral', growth: '+320%', platform: 'twitter' },
        { topic: 'Video Marketing Trends', discussions: 32000, velocity: 'hot', growth: '+150%', platform: 'twitter' }
      ]
    };
  } catch (error) {
    console.error('Twitter fetch error:', error);
    return { hashtags: [], topics: [] };
  }
}

// Helper function to fetch TikTok trends
async function fetchTikTokTrends(niche) {
  try {
    // Mock TikTok trends (replace with actual TikTok API call)
    return {
      sounds: [
        { name: 'Trending Beat 2025', uses: 2500000, velocity: 'viral', growth: '+450%', platform: 'tiktok' },
        { name: 'Motivation Sound', uses: 1800000, velocity: 'hot', growth: '+280%', platform: 'tiktok' }
      ],
      hashtags: [
        { tag: '#TikTokTips', posts: 890000, velocity: 'viral', growth: '+350%', platform: 'tiktok' }
      ]
    };
  } catch (error) {
    console.error('TikTok fetch error:', error);
    return { sounds: [], hashtags: [] };
  }
}

// Helper function to fetch Reddit trends
async function fetchRedditTrends(niche) {
  try {
    // Mock Reddit trends (replace with actual Reddit API call)
    return {
      topics: [
        { topic: 'Best Marketing Strategies 2025', discussions: 12500, velocity: 'hot', growth: '+220%', platform: 'reddit' },
        { topic: 'Social Media Algorithm Changes', discussions: 9800, velocity: 'trending', growth: '+150%', platform: 'reddit' }
      ]
    };
  } catch (error) {
    console.error('Reddit fetch error:', error);
    return { topics: [] };
  }
}

// Calculate niche match score
async function calculateNicheMatch(items, niche) {
  return items.map(item => ({
    ...item,
    match: Math.floor(Math.random() * 30) + 70 // Mock score 70-100
  }));
}

// Generate content idea using AI
async function generateContentIdea(trend, niche, type) {
  try {
    // Mock AI-generated idea (replace with actual Gemini API call)
    const trendName = trend.tag || trend.name || trend.topic;
    
    return {
      title: `${niche} Content: Leveraging ${trendName}`,
      hook: `Discover how to ride the wave of ${trendName} to boost your ${niche} presence`,
      content: `Create engaging content that combines ${trendName} with your ${niche} expertise. Focus on providing value while capitalizing on the trending topic's momentum. Share insider tips, case studies, or quick wins that resonate with your audience.`,
      format: type === 'sound' ? 'Short Video' : type === 'hashtag' ? 'Carousel Post' : 'Long-form Content',
      platforms: type === 'sound' ? ['TikTok', 'Instagram Reels'] : ['Twitter', 'LinkedIn', 'Instagram'],
      estimatedReach: '50K-200K',
      engagementPrediction: '8-12%',
      hashtags: ['#' + niche.replace(/\s/g, ''), trendName, '#Trending2025', '#ContentMarketing']
    };
  } catch (error) {
    console.error('Generate idea error:', error);
    throw error;
  }
}

// ROUTES - Remove the /api/trends prefix since it's already in the mount path

// Fetch trends endpoint
router.post('/fetch', verifyToken, async (req, res) => {
  try {
    const { niche, platforms = ['twitter', 'tiktok', 'reddit'] } = req.body;
    const results = { hashtags: [], sounds: [], topics: [] };
    const promises = [];

    if (platforms.includes('twitter')) promises.push(fetchTwitterTrends(niche));
    if (platforms.includes('tiktok')) promises.push(fetchTikTokTrends(niche));
    if (platforms.includes('reddit')) promises.push(fetchRedditTrends(niche));

    const allResults = await Promise.allSettled(promises);
    
    allResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const platform = platforms[index];
        if (platform === 'twitter') {
          results.hashtags.push(...(result.value.hashtags || []));
          results.topics.push(...(result.value.topics || []));
        } else if (platform === 'tiktok') {
          results.sounds.push(...(result.value.sounds || []));
          results.hashtags.push(...(result.value.hashtags || []));
        } else if (platform === 'reddit') {
          results.topics.push(...(result.value.topics || []));
        }
      }
    });

    // Calculate niche match scores
    results.hashtags = await calculateNicheMatch(results.hashtags, niche);
    results.sounds = await calculateNicheMatch(results.sounds, niche);
    results.topics = await calculateNicheMatch(results.topics, niche);

    // Sort by match score
    results.hashtags.sort((a, b) => b.match - a.match);
    results.sounds.sort((a, b) => b.match - a.match);
    results.topics.sort((a, b) => b.match - a.match);

    res.json({
      success: true,
      hashtags: results.hashtags.slice(0, 10),
      sounds: results.sounds.slice(0, 5),
      topics: results.topics.slice(0, 8),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fetch trends error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch trends' 
    });
  }
});

// Generate idea endpoint
router.post('/generate-idea', verifyToken, async (req, res) => {
  try {
    const { trend, niche, type } = req.body;

    if (!trend || !niche) {
      return res.status(400).json({ 
        success: false, 
        error: 'Trend and niche are required' 
      });
    }

    const idea = await generateContentIdea(trend, niche, type);
    
    res.json({ 
      success: true, 
      idea, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Generate idea error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate idea' 
    });
  }
});

export default router;