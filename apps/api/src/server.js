import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analytics.js';
import dashboardRoutes from './routes/dashboard.js';

// Import routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import assistantRoutes from './routes/assistant.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/assistant', assistantRoutes); 
app.use('/api/analytics', analyticsRoutes);   
app.use('/api/dashboard', dashboardRoutes);   


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.path} not found` });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});