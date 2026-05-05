import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import HomePage from './pages/Home';
import BlogDetailPage from './pages/BlogDetailPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateBlogPage from './pages/CreateBlogPage';
import LoginPage from './pages/LoginPage';
import EditBlogPage from './pages/EditBlogPage';


// Optional but recommended: A wrapper for protected content
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  // Corrected the hook name to lowercase 'useSelector'
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />

        {/* Redirect if already logged in */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        {/* Private Routes (Wrapped for cleanliness) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateBlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditBlogPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route (Optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;