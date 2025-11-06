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