import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),

  mongoUri:
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/portfolio_db',

  jwtSecret:
    process.env.JWT_SECRET ||
    'futuristic-cyber-portfolio-secret-key-2026',

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || '7d',

  clientUrl:
    process.env.CLIENT_URL || 'http://localhost:5173',

  uploadDir: path.join(process.cwd(), 'uploads'),

  nodeEnv:
    process.env.NODE_ENV || 'development',

  // Admin credentials are required
  adminEmail:
    process.env.ADMIN_EMAIL || '',

  adminPassword:
    process.env.ADMIN_PASSWORD || '',

  // Cloudinary
  cloudinaryCloudName:
    process.env.CLOUDINARY_CLOUD_NAME || '',

  cloudinaryApiKey:
    process.env.CLOUDINARY_API_KEY || '',

  cloudinaryApiSecret:
    process.env.CLOUDINARY_API_SECRET || '',
};