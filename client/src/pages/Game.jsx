import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import { generateChallenge } from '../services/gameService';

import GameCard from '../components/game/GameCard';
import AnswerOption from '../components/game/AnswerOption';
import GameResult from '../components/game/GameResult';
import ScoreBoard from '../components/game/ScoreBoard';
import ChallengeShare from '../components/game/ChallengeShare';

const Game = () => {
    const { user } = useAuth();
    const {
        currentGame,
        gameResult,
        loading,
        error,
        gameStats,
        loadGame,
        answerQuestion,
        resetGame
    } = useGame();

    const [selectedAnswerId, setSelectedAnswerId] = useState(null);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [challengeData, setChallengeData] = useState(null);

    // Load a game when component mounts
    useEffect(() => {
        if (!currentGame && !gameResult) {
            loadGame();
        }
    }, [currentGame, gameResult, loadGame]);

    // Handle error notifications
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleAnswerSelect = (answerId) => {
        setSelectedAnswerId(answerId);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswerId) {
            answerQuestion(selectedAnswerId);
        } else {
            toast.warn('Please select an answer first');
        }
    };

    const handlePlayAgain = () => {
        resetGame();
        setSelectedAnswerId(null);
        loadGame();
    };

    const handleChallenge = async () => {
        try {
            const result = await generateChallenge();
            if (result.success) {
                setChallengeData(result.data);
                setShowChallengeModal(true);
            }
        } catch (err) {
            toast.error('Failed to generate challenge');
        }
    };

    if (loading && !currentGame && !gameResult) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    {gameResult ? (
                        <GameResult
                            result={gameResult}
                            onPlayAgain={handlePlayAgain}
                            onChallenge={handleChallenge}
                        />
                    ) : (
                        <>
                            {currentGame && (
                                <>
                                    <GameCard clues={currentGame.clues} />

                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold text-gray-700 mb-4">
                                            Select the correct destination:
                                        </h3>

                                        {currentGame.answers.map((answer) => (
                                            <AnswerOption
                                                key={answer.id}
                                                answer={answer}
                                                selected={selectedAnswerId === answer.id}
                                                isCorrect={false}
                                                isRevealed={false}
                                                onClick={handleAnswerSelect}
                                            />
                                        ))}

                                        <button
                                            onClick={handleSubmitAnswer}
                                            disabled={!selectedAnswerId || loading}
                                            className={`w-full py-3 rounded-lg font-bold text-white 
                        ${!selectedAnswerId || loading
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-primary-600 hover:bg-primary-700'}`}
                                        >
                                            {loading ? 'Submitting...' : 'Submit Answer'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div>
                    <ScoreBoard stats={gameStats} />
                </div>
            </div>

            {showChallengeModal && challengeData && (
                <ChallengeShare
                    challengeData={challengeData}
                    onClose={() => setShowChallengeModal(false)}
                />
            )}
        </div>
    );
};

export default Game;