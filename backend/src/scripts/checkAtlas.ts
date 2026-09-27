import { connectDB } from '../config/db.js';
import { 
  UserModel, ProfileModel, SkillModel, ExperienceModel, 
  EducationModel, CertificationModel, ProjectModel, ResearchModel, 
  AchievementModel, ServiceModel, TestimonialModel, BlogPostModel, 
  MessageModel, SiteSettingsModel 
} from '../models/schemas.js';

async function countAll() {
  await connectDB();
  const models: [string, any][] = [
    ['User', UserModel],
    ['Profile', ProfileModel],
    ['Skill', SkillModel],
    ['Experience', ExperienceModel],
    ['Education', EducationModel],
    ['Certification', CertificationModel],
    ['Project', ProjectModel],
    ['Research', ResearchModel],
    ['Achievement', AchievementModel],
    ['Service', ServiceModel],
    ['Testimonial', TestimonialModel],
    ['BlogPost', BlogPostModel],
    ['Message', MessageModel],
    ['SiteSettings', SiteSettingsModel]
  ];
  for (const [name, m] of models) {
    const c = await m.countDocuments();
    console.log(name.padEnd(15), ':', c);
  }
  process.exit(0);
}
countAll();
