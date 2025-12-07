
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classRoutes';
import trainingRoutes from './routes/trainingRoutes';
import socialRoutes from './routes/socialRoutes';
import './models/index'; 

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 10000;

// Security & CORS Configuration
app.use(helmet() as unknown as express.RequestHandler);
app.use(cors({
  origin: [
    'https://app.nerdznj.ir', 
    'http://app.nerdznj.ir',
    'http://localhost:10001',
    'http://localhost:5173' // For local dev
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/training', trainingRoutes); // AI Training Plans
app.use('/api/v1/social', socialRoutes);     // Social Feed

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SmartFitHub Core System Operational' });
});

// Start Server
const start = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SmartFitHub Server running on port ${PORT}`);
  });
};

start();