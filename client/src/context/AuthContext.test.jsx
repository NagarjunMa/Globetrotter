import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import * as authService from '../services/authService';

jest.mock('../services/authService', () => ({
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
}));

const TestConsumer = () => {
    const context = React.useContext(AuthContext);
    return (
        <div>
            <div data-testid="loading">{context.loading.toString()}</div>
            <div data-testid="isAuthenticated">{context.isAuthenticated.toString()}</div>
            <div data-testid="error">{context.error || 'no error'}</div>
            <div data-testid="username">{context.user?.username || 'no user'}</div>
            <button onClick={() => context.login('testuser', 'password123')}>Login</button>
            <button onClick={() => context.register('newuser', 'password123')}>Register</button>
            <button onClick={() => context.logout()}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('handles login error', async () => {
        const errorMessage = 'Invalid credentials';

        // Setup mock to simulate login failure
        authService.login.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByRole('button', { name: /login/i }).click();
        });

        expect(screen.getByTestId('error').textContent).toBe(errorMessage);
        expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    });
});