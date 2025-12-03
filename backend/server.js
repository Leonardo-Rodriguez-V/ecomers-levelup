require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const offerRoutes = require('./routes/offers');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS mejorado para producción
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://e-comers-lupg-bvn7-git-main-leonardorvzs-projects.vercel.app',
  'https://e-comers-lupg-bvn7-9r2f6utq4-leonardorvzs-projects.vercel.app',
  process.env.FRONTEND_ORIGIN
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/events', eventRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Root debug
app.get('/', (req, res) => res.send('Backend LevelUp corriendo. Usa /api/...'));

// Conectar a Mongo y arrancar
const mongoUri = process.env.MONGO_URI;

// Opciones de conexión optimizadas
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2
};

mongoose.connect(mongoUri, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected optimizado');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });