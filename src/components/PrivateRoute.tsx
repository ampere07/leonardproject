import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type PrivateRouteProps = {
  children: React.ReactNode;
  allowedRole?: 'student' | 'teacher';
};

// Mock user for development
const MOCK_USERS = {
  student: {
    id: 'mock-student-id',
    email: 'student@123.com',
    firstName: 'Sample',
    lastName: 'Student',
    role: 'student' as const,
  },
  teacher: {
    id: 'mock-teacher-id',
    email: 'teacher@123.com',
    firstName: 'Sample',
    lastName: 'Teacher',
    role: 'teacher' as const,
  }
};

export function PrivateRoute({ children, allowedRole }: PrivateRouteProps) {
  const { user } = useAuth();
  
  // For development: automatically set mock user based on the route
  const mockUser = allowedRole ? MOCK_USERS[allowedRole] : null;
  const effectiveUser = user || mockUser;

  if (!effectiveUser) {
    return <Navigate to="/" />;
  }

  if (allowedRole && effectiveUser.role !== allowedRole) {
    return <Navigate to={`/${effectiveUser.role}-dashboard`} />;
  }

  return <>{children}</>;
}