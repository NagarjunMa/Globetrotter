import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getUserStats } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const Challenge = () => {
    const { id: challengeId } = useParams();
    const { isAuthenticated } = useAuth();

    const [challenger, setChallenger] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // In a real app, you would fetch challenge details from the server
        // For now, we'll extract the username from the challenge ID or use a placeholder
        const fetchChallengeDetails = async () => {
            try {
                setLoading(true);

                // For demo, we'll extract a username from the URL or use a default
                const username = challengeId.split('-')[0] || 'challenger';

                // Get stats for the challenger
                const response = await getUserStats(username);

                if (response.success) {
                    setChallenger({
                        username: response.data.username,
                        stats: response.data.stats
                    });
                } else {
                    setError('Challenge not found');
                }
            } catch (err) {
                setError('Failed to load challenge');
                toast.error('Failed to load challenge details');
            } finally {
                setLoading(false);
            }
        };

        fetchChallengeDetails();
    }, [challengeId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !challenger) {
        return (
            <div className="max-w-xl mx-auto text-center">
                <div className="bg-red-50 rounded-lg p-8 shadow-md">
                    <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Challenge Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The challenge you're looking for doesn't exist or has expired.
                    </p>
                    <Link to="/" className="btn btn-primary">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 text-white text-center">
                    <h1 className="text-2xl font-bold">
                        Challenge from {challenger.username}
                    </h1>
                    <p>Can you beat their score?</p>
                </div>

                <div className="p-6">
                    <div className="mb-8 text-center">
                        <div className="inline-block bg-blue-50 rounded-full p-5 mb-4">
                            <FaTrophy className="text-4xl text-yellow-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-blue-700 mb-2">
                            {challenger.stats.score} Points
                        </h2>
                        <p className="text-gray-600">
                            {challenger.username} has answered {challenger.stats.correctAnswers} questions correctly
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-8">
                        <h3 className="font-bold text-gray-700 mb-2">How it works:</h3>
                        <ul className="list-disc pl-5 text-gray-600">
                            <li>Answer destination guessing questions</li>
                            <li>Earn 10 points for each correct answer</li>
                            <li>See if you can beat {challenger.username}'s score!</li>
                        </ul>
                    </div>

                    {isAuthenticated ? (
                        <Link
                            to="/game"
                            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-lg transition-colors"
                        >
                            Accept Challenge
                        </Link>
                    ) : (
                        <div>
                            <Link
                                to="/login"
                                className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-lg transition-colors mb-3"
                            >
                                Login to Accept
                            </Link>
                            <Link
                                to="/register"
                                className="block w-full py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-center rounded-lg transition-colors"
                            >
                                Create an Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Challenge;