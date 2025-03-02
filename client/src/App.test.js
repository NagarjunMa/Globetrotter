import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import App from './App';

test('renders app component', () => {
  render(
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );

  // Modify this based on actual content in your App
  // For example, if you have a specific element or text in your main layout
  const appElement = screen.getByTestId('app-container');
  expect(appElement).toBeInTheDocument();
});