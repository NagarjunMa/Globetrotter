import React from 'react';
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

function App() {
  return (
    <div data-testid="app-container">
      <Router>
        <AuthProvider>
          <GameProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game" element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/challenge/:id" element={<Challenge />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
          </GameProvider>
        </AuthProvider>
      </Router>
    </div>

  );
}

export default App;