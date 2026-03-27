import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import ProtectedRoute from './components/ProtectedRoute';
import 'antd/dist/reset.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="profile" element={<div>Profile Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;