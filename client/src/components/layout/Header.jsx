// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold z-10">
                        <FaGlobeAmericas className="text-2xl" />
                        <span>Globetrotter</span>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white focus:outline-none z-10"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        {/* Original navigation content */}
                    </nav>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`fixed inset-0 bg-blue-700 z-50 transition-transform transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        } md:hidden`}
                >
                    <div className="flex flex-col h-full pt-16 px-4">
                        <nav className="flex-1">
                            <ul className="flex flex-col space-y-6 text-xl">
                                {/* Mobile navigation links */}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};