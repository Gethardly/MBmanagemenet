import mongoose, { model } from 'mongoose';
import { UserSchema } from './src/auth/schemas/user.schema';
import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';

configDotenv();
const User = model('User', UserSchema);
const dbConnection = process.env.DB_CONNECTION;

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(dbConnection);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  await User.create({
    displayName: 'admin',
    email: 'admin@test.com',
    role: 'admin',
    password: await bcrypt.hash('adminTeka', 10),
  });

  await User.create({
    displayName: 'Operator',
    email: 'user@test.com',
    role: 'user',
    password: await bcrypt.hash('user', 10),
  });

  await db.close();
};
void run();
