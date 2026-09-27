import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env.js';
import cloudinary from '../config/cloudinary.js';
import { dbRepository } from '../services/dbRepository.js';
import { IMediaItem } from '../types/index.js';

// ─── Local disk storage (used in development when Cloudinary is not configured) ───
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ─── In production (Cloudinary configured), use memoryStorage so we can stream to Cloudinary ───
const isCloudinaryConfigured =
  !!config.cloudinaryCloudName &&
  !!config.cloudinaryApiKey &&
  !!config.cloudinaryApiSecret;

export const upload = multer({
  storage: isCloudinaryConfigured ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images (JPEG, PNG, WEBP, GIF, SVG) and PDF documents are allowed.'));
  }
});

// ─── Upload Handler ───
export const uploadMedia = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded.' });
    return;
  }

  try {
    let fileUrl: string;
    let publicId: string | undefined;

    if (isCloudinaryConfigured) {
      // ── PRODUCTION: stream buffer directly to Cloudinary ──
      const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio-cms',
            resource_type: 'auto',
            // Preserve original filename stem (sanitized)
            public_id: `portfolio-cms/${Date.now()}-${req.file!.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')}`
          },
          (error, result) => {
            if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
            resolve(result as { secure_url: string; public_id: string });
          }
        );
        stream.end(req.file!.buffer);
      });

      fileUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;

      console.log(`[Media] Uploaded to Cloudinary: ${fileUrl}`);
    } else {
      // ── DEVELOPMENT: local disk (file already saved by multer diskStorage) ──
      fileUrl = `/uploads/${(req.file as Express.Multer.File & { filename: string }).filename}`;
      console.log(`[Media] Saved locally (dev mode): ${fileUrl}`);
    }

    const mediaItem: IMediaItem = {
      _id: `media_${Date.now()}`,
      url: fileUrl,
      cloudinaryPublicId: publicId,
      filename: isCloudinaryConfigured
        ? path.basename(fileUrl)
        : (req.file as Express.Multer.File & { filename: string }).filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };

    await dbRepository.addItem<IMediaItem>('media', mediaItem);

    res.status(201).json({
      success: true,
      data: mediaItem,
      message: isCloudinaryConfigured
        ? 'File uploaded to Cloudinary successfully.'
        : 'File uploaded locally (dev mode).'
    });
  } catch (error: any) {
    console.error('[Media] Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed.' });
  }
};

// ─── Get All Media ───
export const getMedia = async (req: Request, res: Response) => {
  const media = await dbRepository.getCollection<IMediaItem>('media');
  res.json({ success: true, data: media });
};

// ─── Delete Media ───
export const deleteMedia = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const item = await dbRepository.getItem<IMediaItem>('media', id);

  if (item) {
    if (isCloudinaryConfigured && item.cloudinaryPublicId) {
      // ── PRODUCTION: delete from Cloudinary ──
      try {
        await cloudinary.uploader.destroy(item.cloudinaryPublicId, { resource_type: 'auto' });
        console.log(`[Media] Deleted from Cloudinary: ${item.cloudinaryPublicId}`);
      } catch (e) {
        console.error('[Media] Cloudinary delete error:', e);
      }
    } else {
      // ── DEVELOPMENT: delete from local disk ──
      const filePath = path.join(uploadDir, item.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('[Media] Local file delete error:', e);
        }
      }
    }
    await dbRepository.deleteItem('media', id);
  }

  res.json({ success: true, message: 'Media file removed.' });
};
