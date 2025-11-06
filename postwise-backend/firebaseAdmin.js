import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// LOAD SERVICE ACCOUNT KEY
// ============================================
let serviceAccount;
try {
  const serviceAccountPath = './serviceAccountKey.json';
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  console.log('✅ Firebase service account loaded');
} catch (error) {
  console.error('❌ Failed to load Firebase service account');
  console.error('💡 Make sure serviceAccountKey.json exists in root directory');
  console.error('📖 Get it from: Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

// ============================================
// INITIALIZE FIREBASE ADMIN
// ============================================
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  process.exit(1);
}

// ============================================
// EXPORT FIRESTORE & AUTH
// ============================================
export const db = admin.firestore();
export const auth = admin.auth();
export default admin;