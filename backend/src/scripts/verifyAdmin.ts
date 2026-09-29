import { connectDB } from '../config/db.js';
import { UserModel } from '../models/schemas.js';
import { store } from '../services/store.js';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

async function verifyAndSyncAdmin() {
  await connectDB();
  console.log('Target Admin Email:', config.adminEmail);


  let user = await UserModel.findOne({ email: config.adminEmail });
  if (!user) {
    console.log('Admin not found in MongoDB. Creating admin...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.adminPassword, salt);
    user = await UserModel.create({
      name: 'Ased Ali Sekh(Admin)',
      email: config.adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin created in MongoDB.');
  } else {
    console.log('Found existing admin in MongoDB.');
    const matches = await bcrypt.compare(config.adminPassword, user.password);
    console.log('Password matches .env ADMIN_PASSWORD?', matches);
    if (!matches) {
      console.log('Updating MongoDB admin password to match .env ADMIN_PASSWORD...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(config.adminPassword, salt);
      user.password = hashedPassword;
      await user.save();
      console.log('Admin password updated in MongoDB.');
    }
  }

  // Also verify/update store.json admin so fallback is synchronized
  const storeUser = store.getUserByEmail(config.adminEmail);
  if (!storeUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.adminPassword, salt);
    store.addUser({
      _id: 'admin_primary',
      name: 'Ased Ali Sekh(Admin)',
      email: config.adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } else if (storeUser.password) {
    const storeMatches = await bcrypt.compare(config.adminPassword, storeUser.password);
    if (!storeMatches) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(config.adminPassword, salt);
      store.updateUser(storeUser._id, { password: hashedPassword });
      console.log('Updated store.json admin password as well.');
    }
  }

  console.log('VERIFICATION COMPLETE: Admin user is ready for login.');
  process.exit(0);
}

verifyAndSyncAdmin().catch((err) => {
  console.error('Error verifying admin:', err);
  process.exit(1);
});
