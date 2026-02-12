// Main App Component with Routing + Page Transitions + Auth Redirect

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, DelegateRoute } from './components/SharedComponents';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import CourseDetail from './pages/CourseDetail';
import Questions from './pages/Questions';
import AdminDashboard from './pages/AdminDashboard';
import ManageCourses from './pages/ManageCourses';
import UploadMaterials from './pages/UploadMaterials';
import AdminQuestions from './pages/AdminQuestions';
import LevelSelection from './pages/LevelSelection';
import AdminStudentManagement from './pages/AdminStudentManagement';
import StaffManagement from './pages/StaffManagement';
import DelegateDashboard from './pages/DelegateDashboard';
import VerifyEmail from './pages/VerifyEmail';

// Smart home redirect — ALL authenticated users go to the Study Hub
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // Everyone sees the Study Hub (courses & levels) as their home page
  return <Navigate to="/study-hub" />;
};

// Page wrapper for transition animation
const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <div className="page-enter" key={location.pathname}>
      {children}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <PageTransition>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />

        {/* Protected Routes - Student */}
        <Route
          path="/levels"
          element={
            <ProtectedRoute>
              <LevelSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-hub"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        {/* Legacy /dashboard route redirects to Study Hub */}
        <Route path="/dashboard" element={<Navigate to="/study-hub" replace />} />
        <Route
          path="/my-dashboard"
          element={
            <ProtectedRoute>
              <PersonalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />

        {/* Delegate Route */}
        <Route
          path="/delegate"
          element={
            <DelegateRoute>
              <DelegateDashboard />
            </DelegateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <DelegateRoute>
              <ManageCourses />
            </DelegateRoute>
          }
        />
        <Route
          path="/admin/upload"
          element={
            <DelegateRoute>
              <UploadMaterials />
            </DelegateRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <DelegateRoute>
              <AdminQuestions />
            </DelegateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <AdminRoute>
              <AdminStudentManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <AdminRoute>
              <StaffManagement />
            </AdminRoute>
          }
        />

        {/* Default & Catch-all → Smart Home Redirect */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </PageTransition>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
