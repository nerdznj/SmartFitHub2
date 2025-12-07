import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
// @ts-ignore
import xss from 'xss-clean';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classRoutes';
import trainingRoutes from './routes/trainingRoutes';
import socialRoutes from './routes/socialRoutes';
import './models/index'; 

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 10000;

// ================= SECURITY MIDDLEWARE =================

// 1. Set Security Headers
// Fix: Cast to any to resolve TypeScript overload mismatch
app.use(helmet() as any);

// 2. Prevent Parameter Pollution
// Fix: Cast to any to resolve TypeScript overload mismatch
app.use(hpp() as any);

// 3. Data Sanitization against XSS
app.use(xss() as any);

// 4. Rate Limiting (General)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
// Fix: Cast to any to resolve TypeScript overload mismatch
app.use('/api', limiter as any);

// 5. CORS Configuration
// Fix: Cast to any to resolve TypeScript overload mismatch
app.use(cors({
  origin: [
    'https://app.nerdznj.ir', 
    'http://app.nerdznj.ir',
    'http://82.115.21.155', // Your Server IP
    'http://localhost:10001',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}) as any);

app.use(express.json({ limit: '10kb' })); // Limit body size

// ================= ROUTES =================

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/training', trainingRoutes);
app.use('/api/v1/social', socialRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SmartFitHub Core System Operational',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start Server
const start = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SmartFitHub Secure Server running on port ${PORT}`);
  });
};

start();