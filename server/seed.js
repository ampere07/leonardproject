import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema (matching the one in index.js)
const userSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Sample users data
const users = [
  {
    firebaseId: 'student123', // This will be replaced with actual Firebase UID
    firstName: 'Sample',
    lastName: 'Student',
    email: 'student@123.com',
    birthDate: new Date('2000-01-01'),
    phoneNumber: '1234567890',
    role: 'student'
  },
  {
    firebaseId: 'teacher123', // This will be replaced with actual Firebase UID
    firstName: 'Sample',
    lastName: 'Teacher',
    email: 'teacher@123.com',
    birthDate: new Date('1990-01-01'),
    phoneNumber: '0987654321',
    role: 'teacher'
  }
];

// Function to create users
async function createUsers() {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create new users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    console.log('Sample users created successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating users:', error);
    mongoose.connection.close();
  }
}

createUsers();