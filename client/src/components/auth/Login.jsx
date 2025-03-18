import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobeAmericas, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, loading } = useAuth();
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            await login(username, password);
            navigate('/game');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
            <div className="text-center mb-8">
                <FaGlobeAmericas className="mx-auto text-4xl text-blue-600" />
                <h2 className="mt-4 text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="mt-2 text-gray-600">Sign in to continue your travel adventures</p>
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
                        placeholder="Enter your username"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                    {loading ? (
                        <span className="animate-spin mr-2">&#9696;</span>
                    ) : (
                        <FaSignInAlt className="mr-2" />
                    )}
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;