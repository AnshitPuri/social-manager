import { auth } from '../firebaseAdmin.js';

/**
 * Middleware to verify Firebase ID token from frontend
 * Extracts token from Authorization header: "Bearer "
 * Attaches decoded user info to req.user
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided' 
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    // Verify token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null
    };

    console.log(`✅ Authenticated: ${req.user.email}`);
    next();
    
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional middleware - check if user exists in Firestore
 */
export const checkUserExists = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User profile does not exist' 
      });
    }
    
    req.userProfile = userDoc.data();
    next();
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};