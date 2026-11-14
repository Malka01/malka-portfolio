import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(SCRIPT_DIR, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const SALT_ROUNDS = 10;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Add it to .env.local and try again.');
  process.exit(1);
}

const DEMO_PASSWORD = 'Demo@1234';
const DEMO_PASSWORD_HASH = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

const DEMO_USERS = [
  {
    email: 'superadmin@medicare360.demo',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'SUPER_ADMIN',
    phone: '+94 77 000 0001',
  },
  {
    email: 'admin@medicare360.demo',
    firstName: 'Kamal',
    lastName: 'Perera',
    role: 'ADMIN',
    phone: '+94 77 000 0002',
  },
  {
    email: 'doctor@medicare360.demo',
    firstName: 'Dr. Nimal',
    lastName: 'Fernando',
    role: 'DOCTOR',
    phone: '+94 77 000 0003',
  },
  {
    email: 'reception@medicare360.demo',
    firstName: 'Sanduni',
    lastName: 'Silva',
    role: 'RECEPTIONIST',
    phone: '+94 77 000 0004',
  },
  {
    email: 'patient@medicare360.demo',
    firstName: 'Chamara',
    lastName: 'Jayasinghe',
    role: 'PATIENT',
    phone: '+94 77 000 0005',
  },
  {
    email: 'pharmacist@medicare360.demo',
    firstName: 'Ruwan',
    lastName: 'Wickramasinghe',
    role: 'PHARMACIST',
    phone: '+94 77 000 0006',
  },
  {
    email: 'lab@medicare360.demo',
    firstName: 'Ishara',
    lastName: 'Rathnayake',
    role: 'LAB_STAFF',
    phone: '+94 77 000 0007',
  },
];

async function run() {
  console.log('🔌 Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  const db = mongoose.connection.db;
  const users = db.collection('users');

  console.log('🧹 Clearing existing demo users…');
  await users.deleteMany({ email: { $regex: /@medicare360\.demo$/ } });

  console.log('🌱 Inserting demo users…');
  const docs = DEMO_USERS.map((u) => ({
    ...u,
    email: u.email.toLowerCase(),
    passwordHash: DEMO_PASSWORD_HASH,
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await users.insertMany(docs);
  console.log(`✅ Inserted ${result.insertedCount} users`);

  console.log('\n📋 Demo credentials — password for all: ' + DEMO_PASSWORD);
  console.log('─'.repeat(58));
  for (const u of DEMO_USERS) {
    console.log(`  ${u.role.padEnd(14)} ${u.email}`);
  }
  console.log('─'.repeat(58));
  console.log('\n⚠️  These are DEMO credentials. Never use in production.\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});