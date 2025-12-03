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
  process.env.FRONTEND_ORIGIN
];

// Función para validar origen dinámicamente
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Permitir todas las URLs locales y configuradas
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Permitir TODAS las URLs de Vercel
    if (origin.includes('vercel.app') || origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    callback(null, true); // En producción, permitir todo para evitar CORS
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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