import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Simple placeholder for other pages to prevent build errors
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono">
    <div className="text-center">
      <h1 className="text-3xl text-[#00f3ff] mb-4">{title}</h1>
      <p className="text-gray-400">MODULE UNDER CONSTRUCTION</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Placeholder title="IDENTITY CREATION" />} />
        
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/profile" element={<Placeholder title="PROFILE" />} />
        <Route path="/classes" element={<Placeholder title="CLASSES" />} />
        <Route path="/training" element={<Placeholder title="TRAINING" />} />
        <Route path="/social" element={<Placeholder title="SOCIAL NETWORK" />} />
        <Route path="/analytics" element={<Placeholder title="ANALYTICS" />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;