import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Roles from './pages/Roles/Roles';
import Permissions from './pages/Permissions/Permissions';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes wrapped in Layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route 
                          path="/users" 
                          element={
                            <ProtectedRoute requiredPermissions={['users_read']}>
                              <Users />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/roles" 
                          element={
                            <ProtectedRoute requiredPermissions={['roles_read']}>
                              <Roles />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/permissions" 
                          element={
                            <ProtectedRoute requiredPermissions={['permissions_read']}>
                              <Permissions />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;