import { auth } from '../firebaseAdmin.js';


export const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided' 
      });
    }


    const token = authHeader.split('Bearer ')[1];


    const decodedToken = await auth.verifyIdToken(token);
    
 
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