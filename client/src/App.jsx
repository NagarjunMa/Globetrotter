import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Game from './pages/Game';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './pages/Profile';
import Challenge from './pages/Challenge';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { initTokenRefresh } from './services/tokenService';

function App() {
  // Initialize token refresh on app load
  useEffect(() => {
    const refreshInterval = initTokenRefresh();
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <GameProvider>
            <MainLayout>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/game" element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Game />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Profile />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/challenge/:id" element={
                    <ErrorBoundary>
                      <Challenge />
                    </ErrorBoundary>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
          </GameProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;