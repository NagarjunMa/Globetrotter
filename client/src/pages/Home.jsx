import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaMapMarkedAlt, FaPuzzlePiece, FaTrophy, FaShareAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-12 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <FaGlobeAmericas className="inline-block mr-3 animate-bounce-slow" />
                        The Globetrotter Challenge
                    </h1>
                    <p className="text-xl mb-8">
                        Test your travel knowledge with our cryptic destination guessing game!
                    </p>
                    <Link
                        to={isAuthenticated ? "/game" : "/login"}
                        className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
                    >
                        Start Playing Now
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-5xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    How It Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <FaMapMarkedAlt className="text-5xl text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Solve Clues</h3>
                        <p className="text-gray-600">
                            Decipher cryptic clues about famous destinations from around the world.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <FaPuzzlePiece className="text-5xl text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Learn Facts</h3>
                        <p className="text-gray-600">
                            Discover fascinating trivia and fun facts about each destination.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <FaTrophy className="text-5xl text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Earn Points</h3>
                        <p className="text-gray-600">
                            Rack up points with each correct answer and climb the leaderboard.
                        </p>
                    </div>
                </div>
            </div>

            {/* Challenge Section */}
            <div className="bg-blue-50 rounded-2xl p-8 mb-12">
                <div className="max-w-3xl mx-auto text-center">
                    <FaShareAlt className="text-5xl text-blue-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Challenge Your Friends</h2>
                    <p className="text-xl mb-6 text-gray-600">
                        Think you know your global destinations? Challenge your friends to beat your score!
                    </p>
                    <Link
                        to={isAuthenticated ? "/game" : "/register"}
                        className="inline-block bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
                    >
                        {isAuthenticated ? "Start a Challenge" : "Sign Up to Challenge Friends"}
                    </Link>
                </div>
            </div>

            {/* Destinations Preview */}
            <div className="max-w-5xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Explore Destinations Worldwide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Paris', 'Tokyo', 'New York', 'Cairo', 'Sydney', 'Rio de Janeiro'].map((city, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                        >
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-400">{city}</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{city}</h3>
                                <p className="text-gray-500 text-sm">Discover fascinating facts about {city}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-800 rounded-2xl p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
                <p className="text-xl mb-6 max-w-2xl mx-auto">
                    Join thousands of players worldwide in the ultimate geography guessing game!
                </p>
                <Link
                    to={isAuthenticated ? "/game" : "/register"}
                    className="inline-block bg-green-500 text-white hover:bg-green-600 font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
                >
                    {isAuthenticated ? "Play Now" : "Create Free Account"}
                </Link>
            </div>
        </div>
    );
};

export default Home;