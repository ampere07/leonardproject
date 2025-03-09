import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { connectDB } from './mongodb';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export async function login(email: string, password: string, role: 'student' | 'teacher') {
  await connectDB();
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== role) {
    throw new Error('Invalid role selected for this account');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
}

export async function register(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  phoneNumber: string;
  role: 'student' | 'teacher';
}) {
  await connectDB();

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword
  });

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
}