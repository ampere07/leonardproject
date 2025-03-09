import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isLive: {
    type: Boolean,
    default: false
  },
  whiteboardData: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);