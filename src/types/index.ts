export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  role: 'student' | 'teacher';
  createdAt: string;
}

export interface Session {
  _id: string;
  teacherId: string;
  title: string;
  isLive: boolean;
  whiteboardData: string;
  videoUrl?: string;
  createdAt: string;
}

export interface Recording {
  _id: string;
  sessionId: string;
  studentId: string;
  videoUrl: string;
  createdAt: string;
}