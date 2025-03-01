import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobeAmericas, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                    <FaGlobeAmericas className="text-2xl" />
                    <span>Globetrotter</span>
                </Link>

                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link to="/" className="hover:text-blue-200 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/game" className="hover:text-blue-200 transition-colors">
                                Play
                            </Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="flex items-center space-x-1">
                                    <Link to="/profile" className="hover:text-blue-200 transition-colors flex items-center">
                                        <FaUser className="mr-1" />
                                        {user?.username || 'Profile'}
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                                    >
                                        <FaSignOutAlt className="mr-1" />
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;