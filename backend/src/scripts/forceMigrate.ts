/**
 * Force-migrate all store.json data into MongoDB.
 * Run once with: npx tsx src/scripts/forceMigrate.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { store } from '../services/store.js';
import {
  UserModel, ProfileModel, SkillModel, ExperienceModel,
  EducationModel, CertificationModel, ProjectModel, ResearchModel,
  AchievementModel, ServiceModel, TestimonialModel, BlogPostModel,
  SiteSettingsModel
} from '../models/schemas.js';

async function forceMigrate() {
  console.log('\n🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI!, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected.\n');

  const collections = [
    { name: 'skills',         model: SkillModel,         data: store.getCollection('skills') },
    { name: 'experience',     model: ExperienceModel,    data: store.getCollection('experience') },
    { name: 'education',      model: EducationModel,     data: store.getCollection('education') },
    { name: 'certifications', model: CertificationModel, data: store.getCollection('certifications') },
    { name: 'projects',       model: ProjectModel,       data: store.getCollection('projects') },
    { name: 'research',       model: ResearchModel,      data: store.getCollection('research') },
    { name: 'achievements',   model: AchievementModel,   data: store.getCollection('achievements') },
    { name: 'services',       model: ServiceModel,       data: store.getCollection('services') },
    { name: 'testimonials',   model: TestimonialModel,   data: store.getCollection('testimonials') },
    { name: 'blogPosts',      model: BlogPostModel,      data: store.getCollection('blogPosts') },
  ];

  // Profile
  const profile = store.getProfile();
  if (profile) {
    await ProfileModel.deleteMany({});
    await ProfileModel.create({ ...profile, _id: undefined });
    console.log('✅ profile        → migrated');
  }

  // Users
  const users = store.getUsers();
  if (users.length > 0) {
    await UserModel.deleteMany({});
    await UserModel.insertMany(users.map(u => ({ ...u, _id: undefined })));
    console.log(`✅ users          → ${users.length} migrated`);
  }

  // Site Settings
  const settings = store.getSettings();
  if (settings) {
    await SiteSettingsModel.deleteMany({});
    await SiteSettingsModel.create({ ...settings, _id: undefined });
    console.log('✅ siteSettings   → migrated');
  }

  // All collections
  for (const col of collections) {
    await col.model.deleteMany({});
    if (col.data && col.data.length > 0) {
      await col.model.insertMany(col.data.map((item: any) => ({ ...item, _id: undefined })));
      console.log(`✅ ${col.name.padEnd(14)} → ${col.data.length} documents`);
    } else {
      console.log(`⚪ ${col.name.padEnd(14)} → empty in store.json, skipped`);
    }
  }

  console.log('\n🎉 Migration complete! All store.json data is now in MongoDB Atlas.\n');
  await mongoose.disconnect();
  process.exit(0);
}

forceMigrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
