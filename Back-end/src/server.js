import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './configs/db.js';
import errorHandlerModule from './Middleware/errorHandler.js';
import { globalLimiter } from './Middleware/rateLimiter.js';

dotenv.config();

const { errorHandler } = errorHandlerModule;

// ── Routes ────────────────────────────────────────────────
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import sellerRoutes from './Routes/sellerRoutes.js';
import publicRoutes from './Routes/publicRoutes.js';

// ── Connect DB ────────────────────────────────────────────
connectDB();

const app = express();

// ── Security Middleware ───────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(globalLimiter);

// ── Body Parsing ──────────────────────────────────────────
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'StyleStore API is running 🚀', env: process.env.NODE_ENV })
);

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api', publicRoutes);   // categories + coupon validation

// ── 404 handler ───────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found.' })
);

// ── Global Error Handler ──────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// ── Graceful shutdown ────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully.');
  server.close(() => process.exit(0));
});

export default app;
