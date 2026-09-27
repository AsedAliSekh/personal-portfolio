import { Request, Response } from 'express';
import { MessageModel, AnalyticsModel } from '../models/schemas.js';

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message, projectType, budget, timeline } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const doc = await MessageModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'Project Inquiry',
      message: message.trim(),
      projectType: projectType || 'General Consultation',
      budget: budget || '',
      timeline: timeline || '',
      isRead: false,
      isArchived: false
    });

    const saved = { ...doc.toObject(), _id: doc._id.toString() };

    // Record analytics event in MongoDB
    try {
      await AnalyticsModel.create({
        eventType: 'contact_submit',
        path: '/contact',
        targetId: saved._id,
        userAgent: req.headers['user-agent']
      });
    } catch {
      // Non-blocking analytics
    }

    res.status(201).json({
      success: true,
      data: saved,
      message: 'Thank you for reaching out! Your message has been received securely.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit message.' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filter } = req.query;
    let query: any = {};

    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'archived') {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    const docs = await MessageModel.find(query).sort({ createdAt: -1 }).lean();
    const messages = docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    const unreadCount = await MessageModel.countDocuments({ isRead: false });

    res.json({
      success: true,
      data: messages,
      unreadCount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to retrieve messages.' });
  }
};

export const markMessageRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isRead } = req.body;
    const targetIsRead = isRead !== undefined ? isRead : true;

    const doc = await MessageModel.findByIdAndUpdate(id, { isRead: targetIsRead }, { new: true }).lean() as any;
    if (!doc) {
      res.status(404).json({ success: false, message: 'Message not found.' });
      return;
    }

    res.json({ success: true, data: { ...doc, _id: doc._id.toString() } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update message.' });
  }
};

export const toggleArchiveMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const doc = await MessageModel.findById(id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Message not found.' });
      return;
    }

    doc.isArchived = !doc.isArchived;
    await doc.save();

    res.json({ success: true, data: { ...doc.toObject(), _id: doc._id.toString() } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to toggle archive status.' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await MessageModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete message.' });
  }
};
