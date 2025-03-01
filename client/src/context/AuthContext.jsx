import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, login, register, logout } from '../services/authService';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = () => {
            if (isAuthenticated()) {
                setUser(getCurrentUser());
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login handler
    const handleLogin = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await login(username, password);
            setUser(result.data);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
            throw err;
        }
    };

    // Register handler
    const handleRegister = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await register(username, password);
            setUser(result.data);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message || 'Registration failed');
            setLoading(false);
            throw err;
        }
    };

    // Logout handler
    const handleLogout = () => {
        logout();
        setUser(null);
    };

    // Update user data
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Context value
    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};