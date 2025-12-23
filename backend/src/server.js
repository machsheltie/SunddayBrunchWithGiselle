import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.js';
import episodeRoutes from './routes/episodeRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sunday Brunch API is running' });
});

// API routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api', contentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sunday Brunch API running on http://localhost:${PORT}`);
  console.log(`📡 Frontend CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET /health`);
  console.log(`  GET /api/recipes`);
  console.log(`  GET /api/recipes/:slug`);
  console.log(`  GET /api/episodes`);
  console.log(`  GET /api/episodes/:slug`);
  console.log(`  GET /api/featured`);
});
