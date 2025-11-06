import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

/**
 * POST /api/improve
 * Generates improved versions of caption in different tones
 * Body: { content: string, tone: 'professional' | 'friendly' | 'funny' }
 */
router.post('/', async (req, res) => {
  try {
    // ===========================
    // TEMP MOCK USER (for testing)
    // Remove this line when using real Firebase auth
    req.user = { uid: 'test123', email: 'test@example.com' };
    // ===========================

    // If you want real token verification, uncomment this line:
    // await verifyToken(req, res, () => {});

    const { content, tone = 'professional' } = req.body;
    const { uid, email } = req.user;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log(`✨ Generating improved captions (${tone}) for user: ${email}`);

    // ============================================
    // GENERATE IMPROVED VERSIONS
    // ============================================
    const improvedVersions = generateImprovedCaptions(content, tone);

    // ============================================
    // SAVE TO FIRESTORE
    // ============================================
    await db.collection('improvements').add({
      userId: uid,
      originalContent: content,
      tone,
      improvedVersions,
      createdAt: new Date()
    });

    res.json({
      success: true,
      data: {
        original: content,
        tone,
        improved: improvedVersions
      }
    });
  } catch (error) {
    console.error('Error improving content:', error);
    res.status(500).json({ error: 'Failed to improve content' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateImprovedCaptions(content, tone) {
  const versions = [];

  switch(tone) {
    case 'professional':
      versions.push({ id: 1, caption: `${content}\n\n#Professional #Business #Growth`, description: 'Professional tone with business hashtags' });
      versions.push({ id: 2, caption: `Elevating your perspective: ${content}`, description: 'Enhanced professional version' });
      versions.push({ id: 3, caption: `${content}\n\nWhat are your thoughts on this?`, description: 'Engaging professional tone' });
      break;

    case 'friendly':
      versions.push({ id: 1, caption: `Hey friends! 👋 ${content}`, description: 'Warm and friendly opening' });
      versions.push({ id: 2, caption: `${content} 😊\n\nLet me know what you think!`, description: 'Casual and inviting' });
      versions.push({ id: 3, caption: `Just wanted to share: ${content} ❤️`, description: 'Personal and authentic' });
      break;

    case 'funny':
      versions.push({ id: 1, caption: `${content} 😂\n\n(No seriously though!)`, description: 'Humorous take' });
      versions.push({ id: 2, caption: `Plot twist: ${content} 🤯`, description: 'Playful and engaging' });
      versions.push({ id: 3, caption: `${content}\n\nI'll see myself out 🚪😅`, description: 'Light-hearted humor' });
      break;

    default:
      versions.push({ id: 1, caption: content, description: 'Original content' });
  }

  return versions;
}

export default router;
