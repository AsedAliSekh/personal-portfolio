import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import bcrypt from 'bcryptjs';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { UserModel } from './models/schemas.js';
import { dbRepository } from './services/dbRepository.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Trust reverse proxy headers (required on Render, Railway, Heroku, Nginx)
app.set('trust proxy', 1);

// Gzip compression for all responses
app.use(compression());

// Health check (before any rate limiter so monitoring tools are never blocked)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Futuristic Portfolio API Engine',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Global rate limiter — 1500 requests per 15 min per IP (skipped in dev and localhost)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'development' ? 5000 : 1500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (req.path === '/api/health') return true;
    if (config.nodeEnv === 'development') return true;
    const ip = req.ip || req.socket.remoteAddress;
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  },
  message: { success: false, message: 'Too many requests. Please slow down.' }
});
app.use(globalLimiter);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  config.clientUrl
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, same-origin)
    if (!origin || allowedOrigins.includes(origin) || (config.nodeEnv === 'development' && origin.startsWith('http://localhost:'))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// (Health check is defined above the global limiter)

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', messageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api', contentRoutes);

// Centralized error handler
app.use(errorHandler);

// Initialization & Start
const startServer = async () => {
  try {
    await connectDB();

    // Sync Admin Credentials from .env → MongoDB on every startup
    // This ensures changing ADMIN_EMAIL or ADMIN_PASSWORD in .env always takes effect.
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.adminPassword, salt);

    if (!existingAdmin) {
      await UserModel.create({
        name: 'Ased (Admin)',
        email: config.adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Auth] ✅ Admin created in MongoDB: ${config.adminEmail}`);
    } else {
      // Always update email + password from current .env values
      await UserModel.updateOne(
        { _id: existingAdmin._id },
        { $set: { email: config.adminEmail, password: hashedPassword } }
      );
      console.log(`[Auth] 🔄 Admin credentials synced from .env → MongoDB: ${config.adminEmail}`);
    }

    const server = app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`🚀 PORTFOLIO BACKEND ONLINE ON PORT ${config.port}`);
      console.log(`🔗 REST API Root: http://localhost:${config.port}/api`);
      console.log(`📡 Health Check:  http://localhost:${config.port}/api/health`);
      console.log(`=======================================================`);
    });

    const shutdown = () => {
      server.close(() => {
        console.log('[Server] Process terminating, port released.');
        process.exit(0);
      });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    return server;
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
