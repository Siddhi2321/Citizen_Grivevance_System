// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/citizen/LandingPage';
import GrievanceSubmission from './pages/citizen/GrievanceSubmission';
import GrievanceTracking from './pages/citizen/GrievanceTracking';
import CitizenLogin from './pages/citizen/CitizenLogin';
import CitizenDashboard from './pages/citizen/Dashboard';
import OfficerLogin from './pages/officer/OfficerLogin';
import OfficerDashboard from './pages/officer/Dashboard';
import OfficerAnalytics from './pages/officer/Analytics';
import OfficerGrievanceDetails from './pages/officer/officerGrivanceDetails';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnalytics from './pages/admin/Analytics';
import GrievanceReopen from './pages/citizen/GrievanceReopen';

// Simple authentication context (you can replace this with a proper auth system)
const useAuth = () => {
  const userType = localStorage.getItem('userType');
  const isAuthenticated = !!localStorage.getItem('isAuthenticated');
  return { userType, isAuthenticated };
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const { userType, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedUserTypes.includes(userType)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Admin Login Component (placeholder)
const AdminLogin = () => {
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate admin login
    localStorage.setItem('userType', 'admin');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Admin User');
    window.location.href = '/admin/dashboard';
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Username:</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login as Admin
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/officer/login" element={<OfficerLogin />} />
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        <Route path="/submit" element={<GrievanceSubmission />} />
        <Route path="/track/:trackingId" element={<GrievanceTracking />} />
        
        {/* Citizen Protected Routes */}
        <Route 
          path="/citizen/dashboard" 
          element={
            <ProtectedRoute allowedUserTypes={['citizen']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/citizen/reopen/:grievanceId" 
          element={
            <ProtectedRoute allowedUserTypes={['citizen']}>
              <GrievanceReopen />
            </ProtectedRoute>
          } 
        />
        
        {/* Officer Protected Routes */}
        <Route 
          path="/officer/dashboard" 
          element={
            <ProtectedRoute allowedUserTypes={['officer']}>
              <OfficerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/officer/analytics" 
          element={
            <ProtectedRoute allowedUserTypes={['officer']}>
              <OfficerAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/officer/grievance/:grievanceId" 
          element={
            <ProtectedRoute allowedUserTypes={['officer']}>
              <OfficerGrievanceDetails />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Protected Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
