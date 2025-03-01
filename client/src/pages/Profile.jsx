import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaTrophy, FaHistory, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { getProfile } from '../services/authService';
import ScoreBoard from '../components/game/ScoreBoard';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await getProfile();

                if (response.success) {
                    updateUser(response.data);
                }
            } catch (err) {
                toast.error('Failed to fetch profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [updateUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600">
                            <FaUser className="text-3xl" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
                            <p className="text-blue-100">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-blue-500" />
                        Game Stats
                    </h2>

                    <ScoreBoard stats={user?.gameStats || {
                        totalGames: 0,
                        correctAnswers: 0,
                        incorrectAnswers: 0,
                        score: 0
                    }} />

                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FaHistory className="mr-2 text-blue-500" />
                            Recent Games
                        </h2>

                        {user?.recentGames && user.recentGames.length > 0 ? (
                            <div className="bg-white rounded-lg shadow border">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Result
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {user.recentGames.map((game, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(game.playedAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {game.correct ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Correct
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Incorrect
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <FaTrophy className="mx-auto text-3xl text-gray-400 mb-2" />
                                <p className="text-gray-500">No game history yet</p>
                                <Link to="/game" className="mt-4 inline-block btn btn-primary">
                                    Play Your First Game
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;