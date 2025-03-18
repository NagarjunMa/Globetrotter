import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserStats } from './../services/authService';
import { useAuth } from './../hooks/useAuth';

const Challenge = () => {
    const { id: challengeId } = useParams();
    const { isAuthenticated } = useAuth();
    const [challenger, setChallenger] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallengerInfo = async () => {
            try {
                // Extract username from challenge ID (first part before -)
                const username = challengeId.split('-')[0];
                const response = await getUserStats(username);

                if (response.success) {
                    setChallenger({
                        username: response.data.username,
                        stats: response.data.stats
                    });
                }
            } catch (err) {
                setError('Challenge not found');
            } finally {
                setLoading(false);
            }
        };

        fetchChallengerInfo();
    }, [challengeId]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>;
    }

    if (error || !challenger) {
        return <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Challenge not found</h2>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">
                {challenger.username} has challenged you!
            </h1>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-2">Their Score: {challenger.stats.score}</h2>
                <p className="mb-4">They've answered {challenger.stats.correctAnswers} questions correctly!</p>
                <p>Think you can beat them?</p>
            </div>

            {isAuthenticated ? (
                <Link to="/game" className="btn btn-primary w-full py-3 text-center block">
                    Accept Challenge
                </Link>
            ) : (
                <div className="space-y-3">
                    <Link to="/login" className="btn btn-primary w-full py-3 text-center block">
                        Log in to Play
                    </Link>
                    <Link to="/register" className="btn btn-outline w-full py-3 text-center block">
                        Create Account
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Challenge;