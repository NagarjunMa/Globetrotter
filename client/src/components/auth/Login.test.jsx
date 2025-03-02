import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock authentication context
const mockLogin = jest.fn();
const mockAuthContext = {
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

const renderLoginComponent = (contextOverrides = {}) => {
    const mergedContext = { ...mockAuthContext, ...contextOverrides };

    return render(
        <AuthContext.Provider value={mergedContext}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form', () => {
        renderLoginComponent();

        expect(screen.getByPlaceholderText(/username/i)).toBeTruthy();
        expect(screen.getByPlaceholderText(/password/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
    });

    test('allows entering username and password', () => {
        renderLoginComponent();

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    test('calls login function on form submission', async () => {
        mockLogin.mockResolvedValue({ success: true });

        renderLoginComponent();

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
        });
    });

    test('handles login error', async () => {
        const errorMessage = 'Invalid credentials';
        mockLogin.mockRejectedValue(new Error(errorMessage));

        renderLoginComponent();

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });
});