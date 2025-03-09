import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TeacherWhiteboard } from './pages/teacher/Whiteboard';
import { StudentDashboard } from './pages/student/Dashboard';
import { SavedSessions } from './pages/student/SavedSessions';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuthStore } from './store/authStore';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/teacher/whiteboard"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherWhiteboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/saved-sessions"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <SavedSessions />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;