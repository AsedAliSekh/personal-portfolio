import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env.js';
import cloudinary from '../config/cloudinary.js';
import { dbRepository } from '../services/dbRepository.js';
import { IMediaItem, IMediaUsage } from '../types/index.js';
import {
  BlogPostModel,
  ProjectModel,
  TestimonialModel,
  SkillModel,
  CertificationModel,
  ProfileModel,
  SiteSettingsModel,
  MediaModel
} from '../models/schemas.js';

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

// ─── Extract Cloudinary Public ID from URL Helper ───
export const extractCloudinaryPublicId = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;

  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);
    const segments = pathAfterUpload.split('/');

    const publicIdSegments: string[] = [];
    let isPastVersion = false;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!isPastVersion) {
        // Skip version tag like "v1791466952"
        if (/^v\d+$/.test(seg)) {
          isPastVersion = true;
          continue;
        }
        // Skip transformation parameters if present
        if (seg.includes(',') || /^[a-z]_[a-z0-9_]+$/i.test(seg)) {
          continue;
        }
        isPastVersion = true;
      }
      publicIdSegments.push(seg);
    }

    if (publicIdSegments.length === 0) return null;

    const fullPathWithExt = publicIdSegments.join('/');
    // Strip file extension to get the raw Cloudinary public_id
    const publicId = fullPathWithExt.replace(/\.[^/.]+$/, '');
    return decodeURIComponent(publicId);
  } catch (err) {
    console.error('[Media] Failed to extract public_id from URL:', url, err);
    return null;
  }
};

// ─── Determine Resource Type for Cloudinary Destroy ───
const resolveResourceType = (mimeType?: string, url?: string): 'image' | 'raw' | 'video' => {
  if (mimeType) {
    if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('zip') || mimeType.includes('octet-stream')) return 'raw';
    if (mimeType.startsWith('image/')) return 'image';
  }
  if (url) {
    if (/\.(mp4|webm|mov|avi|mp3|wav)$/i.test(url)) return 'video';
    if (/\.(pdf|doc|docx|zip|tar|gz)$/i.test(url)) return 'raw';
  }
  return 'image';
};

// ─── Portfolio Usage Scanner (Centralized Media Controller Engine) ───────────
export const scanPortfolioMediaUsages = async (): Promise<Map<string, IMediaUsage[]>> => {
  const usageMap = new Map<string, IMediaUsage[]>();

  const addUsage = (url: string | undefined | null, usage: IMediaUsage) => {
    if (!url || typeof url !== 'string' || !url.trim()) return;
    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('/uploads/')) return;
    const existing = usageMap.get(cleanUrl) || [];
    existing.push(usage);
    usageMap.set(cleanUrl, existing);
  };

  try {
    // 1. Blog Posts (Cover Image & in-article markdown images)
    const blogs = await BlogPostModel.find().lean();
    for (const b of blogs as any[]) {
      if (b.coverImage) {
        addUsage(b.coverImage, {
          type: 'Blog',
          title: b.title || 'Untitled Dispatch',
          field: 'Cover Image',
          id: b._id.toString()
        });
      }
      if (b.content && typeof b.content === 'string') {
        const mdImageRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
        let match;
        while ((match = mdImageRegex.exec(b.content)) !== null) {
          addUsage(match[1], {
            type: 'Blog',
            title: b.title || 'Untitled Dispatch',
            field: 'In-Article Markdown',
            id: b._id.toString()
          });
        }
      }
    }

    // 2. Projects (Thumbnail, Architecture Diagram, Gallery, Visual Docs)
    const projects = await ProjectModel.find().lean();
    for (const p of projects as any[]) {
      if (p.thumbnail) {
        addUsage(p.thumbnail, {
          type: 'Project',
          title: p.title || 'Untitled Project',
          field: 'Thumbnail',
          id: p._id.toString()
        });
      }
      if (p.architectureDiagram) {
        addUsage(p.architectureDiagram, {
          type: 'Project',
          title: p.title || 'Untitled Project',
          field: 'Architecture Diagram',
          id: p._id.toString()
        });
      }
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((g: string) => {
          addUsage(g, {
            type: 'Project',
            title: p.title || 'Untitled Project',
            field: 'Gallery',
            id: p._id.toString()
          });
        });
      }
      if (Array.isArray(p.visualDocumentation)) {
        p.visualDocumentation.forEach((v: any) => {
          const vUrl = typeof v === 'string' ? v : v?.url;
          addUsage(vUrl, {
            type: 'Project',
            title: p.title || 'Untitled Project',
            field: 'Visual Documentation',
            id: p._id.toString()
          });
        });
      }
    }

    // 3. Testimonials (Client / Author Photo)
    const testimonials = await TestimonialModel.find().lean();
    for (const t of testimonials as any[]) {
      if (t.photoUrl) {
        addUsage(t.photoUrl, {
          type: 'Testimonial',
          title: t.name || 'Client Testimonial',
          field: 'Author Photo',
          id: t._id.toString()
        });
      }
    }

    // 4. Skills (Custom Icon & Brand Logo)
    const skills = await SkillModel.find().lean();
    for (const s of skills as any[]) {
      if (s.logoUrl && (s.logoUrl.startsWith('http') || s.logoUrl.startsWith('/uploads'))) {
        addUsage(s.logoUrl, {
          type: 'Skill',
          title: s.name || 'Skill',
          field: 'Logo Icon',
          id: s._id.toString()
        });
      }
      if (s.icon && (s.icon.startsWith('http') || s.icon.startsWith('/uploads'))) {
        addUsage(s.icon, {
          type: 'Skill',
          title: s.name || 'Skill',
          field: 'Custom Icon',
          id: s._id.toString()
        });
      }
    }

    // 5. Certifications (Certificate Image Credential)
    const certs = await CertificationModel.find().lean();
    for (const c of certs as any[]) {
      if (c.certificateImageUrl) {
        addUsage(c.certificateImageUrl, {
          type: 'Certification',
          title: c.title || 'Certification',
          field: 'Certificate Credential',
          id: c._id.toString()
        });
      }
    }

    // 6. Profile (Avatar & Resume)
    const profile = await ProfileModel.findOne().lean();
    if (profile as any) {
      if ((profile as any).avatarUrl) {
        addUsage((profile as any).avatarUrl, {
          type: 'Profile',
          title: (profile as any).name || 'Profile Avatar',
          field: 'Avatar Image'
        });
      }
      if ((profile as any).resumeUrl) {
        addUsage((profile as any).resumeUrl, {
          type: 'Profile',
          title: 'Resume Document',
          field: 'CV PDF'
        });
      }
    }

    // 7. Site Settings (OpenGraph Image)
    const settings = await SiteSettingsModel.findOne().lean();
    if (settings as any && (settings as any).ogImage) {
      addUsage((settings as any).ogImage, {
        type: 'Site Settings',
        title: 'OpenGraph Meta',
        field: 'OG Share Image'
      });
    }
  } catch (err) {
    console.error('[Media] Error scanning portfolio usages:', err);
  }

  return usageMap;
};

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
      const sanitizedName = req.file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '');

      const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio-cms',
            resource_type: 'auto',
            public_id: `${Date.now()}-${sanitizedName}`
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

      console.log(`[Media] Uploaded to Cloudinary: url="${fileUrl}", public_id="${publicId}"`);
    } else {
      // ── DEVELOPMENT: local disk (file already saved by multer diskStorage) ──
      fileUrl = `/uploads/${(req.file as Express.Multer.File & { filename: string }).filename}`;
      console.log(`[Media] Saved locally (dev mode): ${fileUrl}`);
    }

    const mediaItem: IMediaItem = {
      _id: `media_${Date.now()}`,
      url: fileUrl,
      cloudinaryPublicId: publicId || '',
      filename: isCloudinaryConfigured
        ? path.basename(fileUrl)
        : (req.file as Express.Multer.File & { filename: string }).filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };

    const savedDoc = await dbRepository.addItem<IMediaItem>('media', mediaItem);

    res.status(201).json({
      success: true,
      data: savedDoc,
      message: isCloudinaryConfigured
        ? 'File uploaded to Cloudinary successfully.'
        : 'File uploaded locally (dev mode).'
    });
  } catch (error: any) {
    console.error('[Media] Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed.' });
  }
};

// ─── Get All Media with Automatic Portfolio Sync & Usage Tracking ───────────
export const getMedia = async (req: Request, res: Response) => {
  try {
    // 1. Scan all media usages across the entire portfolio
    const usagesMap = await scanPortfolioMediaUsages();

    // 2. Retrieve existing media items in MediaModel
    const existingMedia = await MediaModel.find().sort({ createdAt: -1 }).lean() as any[];
    const registeredUrls = new Set(existingMedia.map((m) => m.url));

    // 3. Auto-register any media URLs (Cloudinary or /uploads/) found anywhere in the portfolio that are not yet in MediaModel
    const newMediaItemsToInsert: any[] = [];
    for (const [url, usages] of usagesMap.entries()) {
      if (!registeredUrls.has(url) && (url.includes('cloudinary.com') || url.startsWith('/uploads/'))) {
        const publicId = extractCloudinaryPublicId(url);
        const filename = path.basename(url.split('?')[0]);
        const primaryUsage = usages[0];
        const isPdf = url.toLowerCase().includes('.pdf');

        const newItem = {
          url,
          cloudinaryPublicId: publicId || '',
          filename,
          originalName: `${primaryUsage.type}: ${primaryUsage.title} (${primaryUsage.field})`,
          mimeType: isPdf ? 'application/pdf' : 'image/jpeg',
          size: 0,
          uploadedAt: new Date().toISOString()
        };
        newMediaItemsToInsert.push(newItem);
        registeredUrls.add(url);
      }
    }

    if (newMediaItemsToInsert.length > 0) {
      const inserted = await MediaModel.insertMany(newMediaItemsToInsert);
      existingMedia.unshift(...inserted.map((d: any) => d.toObject()));
    }

    // 4. Enrich every media item with its real-time portfolio usage locations
    const enrichedMedia: IMediaItem[] = existingMedia.map((item) => ({
      ...item,
      _id: item._id.toString(),
      usedIn: usagesMap.get(item.url) || []
    }));

    res.json({ success: true, data: enrichedMedia });
  } catch (err: any) {
    console.error('[Media] getMedia error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve media catalog.' });
  }
};

// ─── Delete Media (Purge from CDN + Break All Linked References) ────────────
export const deleteMedia = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const item = await dbRepository.getItem<IMediaItem>('media', id);

  if (!item) {
    res.status(404).json({ success: false, message: 'Media item not found in registry.' });
    return;
  }

  let cdnDeleted = false;
  let cdnResult: any = null;

  // 1. Resolve Cloudinary public_id (from document or extracted from URL)
  const publicId = item.cloudinaryPublicId || extractCloudinaryPublicId(item.url);

  if (isCloudinaryConfigured && publicId) {
    try {
      const resourceType = resolveResourceType(item.mimeType, item.url);
      console.log(`[Media] Deleting from Cloudinary CDN: public_id="${publicId}", resource_type="${resourceType}"`);

      // Destroy from Cloudinary and purge CDN cache immediately
      let destroyResponse = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true // Purges CDN edge cache so link is immediately broken worldwide
      });

      // If not found with inferred resourceType, attempt fallback with raw
      if (destroyResponse.result === 'not found' && resourceType !== 'raw') {
        console.log(`[Media] Asset "${publicId}" not found as ${resourceType}, retrying with raw...`);
        const rawResponse = await cloudinary.uploader.destroy(publicId, {
          resource_type: 'raw',
          invalidate: true
        });
        if (rawResponse.result === 'ok') {
          destroyResponse = rawResponse;
        }
      }

      cdnResult = destroyResponse;
      cdnDeleted = destroyResponse.result === 'ok';
      console.log(`[Media] Cloudinary CDN destroy result:`, destroyResponse);
    } catch (e) {
      console.error('[Media] Cloudinary delete exception:', e);
    }
  }

  // 2. Remove local file if present on disk
  if (item.filename) {
    const filePath = path.join(uploadDir, item.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[Media] Deleted local file: ${filePath}`);
      } catch (e) {
        console.error('[Media] Local file delete error:', e);
      }
    }
  }

  // 3. Cascade Broken Link Cleansing Across All Portfolio Collections
  try {
    const mediaUrl = item.url;
    await Promise.allSettled([
      BlogPostModel.updateMany({ coverImage: mediaUrl }, { coverImage: '' }),
      ProjectModel.updateMany({ thumbnail: mediaUrl }, { thumbnail: '' }),
      ProjectModel.updateMany({ architectureDiagram: mediaUrl }, { architectureDiagram: '' }),
      ProjectModel.updateMany({}, { $pull: { gallery: mediaUrl } }),
      TestimonialModel.updateMany({ photoUrl: mediaUrl }, { photoUrl: '' }),
      SkillModel.updateMany({ logoUrl: mediaUrl }, { logoUrl: '' }),
      CertificationModel.updateMany({ certificateImageUrl: mediaUrl }, { certificateImageUrl: '' }),
      ProfileModel.updateMany({ avatarUrl: mediaUrl }, { avatarUrl: '' }),
      ProfileModel.updateMany({ resumeUrl: mediaUrl }, { resumeUrl: '' }),
      SiteSettingsModel.updateMany({ ogImage: mediaUrl }, { ogImage: '' })
    ]);
    console.log(`[Media] Cascaded removal of "${mediaUrl}" across all database collections.`);
  } catch (cascadeErr) {
    console.error('[Media] Error during cascade cleanup:', cascadeErr);
  }

  // 4. Remove record from Database Media registry
  await dbRepository.deleteItem('media', id);

  res.json({
    success: true,
    message: cdnDeleted
      ? 'Media file permanently deleted from CDN storage, purged from edge caches, and removed from portfolio linkages.'
      : 'Media file removed from media registry and portfolio linkages.',
    cdnDeleted,
    cdnResult
  });
};
