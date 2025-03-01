import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobeAmericas, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { register, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if logged in
        if (isAuthenticated) {
            navigate('/game');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!username || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            // Store debug info in localStorage
            localStorage.setItem('register_attempt', JSON.stringify({
                username,
                timestamp: new Date().toISOString()
            }));

            await register(username, password);
            navigate('/game');
        } catch (err) {
            localStorage.setItem('register_error', JSON.stringify({
                error: err?.message || 'Registration failed',
                timestamp: new Date().toISOString()
            }));
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
            <div className="text-center mb-8">
                <FaGlobeAmericas className="mx-auto text-4xl text-blue-600" />
                <h2 className="mt-4 text-3xl font-bold text-gray-800">Join Globetrotter</h2>
                <p className="mt-2 text-gray-600">Create an account to start your journey</p>
            </div>

            {error && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Choose a unique username"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Choose a password (min. 6 characters)"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                    {loading ? (
                        <span className="animate-spin mr-2">&#9696;</span>
                    ) : (
                        <FaUserPlus className="mr-2" />
                    )}
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;