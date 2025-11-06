import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import analyzeRoutes from './routes/analyze.js';
import improveRoutes from './routes/improve.js';
import planRoutes from './routes/plan.js';
import dashboardRoutes from './routes/dashboard.js';
import accountsRoutes from './routes/accounts.js';
import analyticsRoutes from './routes/analytics.js';
import overviewRoutes from './routes/overview.js';

// Initialize Firebase Admin (must be before routes)
import './firebaseAdmin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow requests from your Vite frontend
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite default
    'http://localhost:3000',  // Alternative
    'http://localhost:5174'   // Alternative Vite port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check (no auth required)
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 PostWise AI Backend',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'PostWise Backend is running!',
    timestamp: new Date().toISOString(),
    firebase: process.env.FIREBASE_PROJECT_ID || 'connected',
    version: '1.0.0'
  });
});

// API Routes - Protected by auth middleware inside each route
app.use('/api/analyze', analyzeRoutes);
app.use('/api/improve', improveRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/overview', overviewRoutes);



// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n🎉 ═══════════════════════════════════════');
  console.log(`🚀 PostWise Backend Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔥 Firebase: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════\n');
});

export default app;