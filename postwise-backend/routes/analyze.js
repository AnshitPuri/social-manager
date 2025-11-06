import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes post content for sentiment, readability, hashtags, emojis
 * Body: { content: string }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const { uid, email } = req.user;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log(`📊 Analyzing post for user: ${email}`);

    // ============================================
    // ANALYSIS LOGIC
    // ============================================

    // 1. Sentiment Analysis (simple implementation)
    const sentimentScore = analyzeSentiment(content);
    
    // 2. Readability Score (Flesch Reading Ease approximation)
    const readabilityScore = calculateReadability(content);
    
    // 3. Hashtag Count
    const hashtags = content.match(/#[\w]+/g) || [];
    const hashtagCount = hashtags.length;
    
    // 4. Emoji Count
    const emojiCount = (content.match(/[\p{Emoji}]/gu) || []).length;
    
    // 5. Word Count
    const wordCount = content.trim().split(/\s+/).length;
    
    // 6. Character Count
    const charCount = content.length;
    
    // 7. AI Feedback (placeholder - integrate OpenAI here)
    const feedback = generateFeedback(sentimentScore, readabilityScore, hashtagCount);

    // ============================================
    // RESPONSE DATA
    // ============================================
    const analysisResult = {
      sentiment: sentimentScore,
      readability: readabilityScore,
      hashtagCount,
      emojiCount,
      wordCount,
      charCount,
      hashtags,
      feedback,
      timestamp: new Date().toISOString()
    };

    // ============================================
    // SAVE TO FIRESTORE (optional)
    // ============================================
    await db.collection('analyses').add({
      userId: uid,
      content,
      result: analysisResult,
      createdAt: new Date()
    });

    res.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('Error analyzing post:', error);
    res.status(500).json({ error: 'Failed to analyze post' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function analyzeSentiment(text) {
  const positiveWords = ['good', 'great', 'awesome', 'amazing', 'excellent', 'love', 'best'];
  const negativeWords = ['bad', 'worst', 'terrible', 'awful', 'hate', 'horrible'];
  
  const lowerText = text.toLowerCase();
  let score = 50; // neutral
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 10;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 10;
  });
  
  return Math.max(0, Math.min(100, score));
}

function calculateReadability(text) {
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const syllables = text.split(/\s+/).reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);
  
  if (sentences === 0 || words === 0) return 50;
  
  // Simplified Flesch Reading Ease
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function generateFeedback(sentiment, readability, hashtagCount) {
  let feedback = [];
  
  if (sentiment < 40) {
    feedback.push('⚠️ Sentiment seems negative. Consider more positive language.');
  } else if (sentiment > 70) {
    feedback.push('✅ Great positive sentiment!');
  } else {
    feedback.push('👍 Neutral sentiment detected.');
  }
  
  if (readability < 40) {
    feedback.push('📖 Content might be hard to read. Try shorter sentences.');
  } else if (readability > 60) {
    feedback.push('✅ Excellent readability!');
  }
  
  if (hashtagCount === 0) {
    feedback.push('🏷️ Consider adding 3-5 relevant hashtags.');
  } else if (hashtagCount > 10) {
    feedback.push('⚠️ Too many hashtags. Keep it under 10.');
  } else {
    feedback.push('✅ Good hashtag usage!');
  }
  
  return feedback.join(' ');
}

export default router;