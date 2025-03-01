import React, { createContext, useState, useContext } from 'react';
import { getRandomDestination, submitAnswer } from '../services/gameService';
import { AuthContext } from './AuthContext';

// Create context
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { user, updateUser } = useContext(AuthContext);

    const [currentGame, setCurrentGame] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gameStats, setGameStats] = useState({
        totalGames: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        score: 0
    });

    // Load a new game
    const loadGame = async () => {
        setLoading(true);
        setError(null);
        setGameResult(null);

        try {
            const result = await getRandomDestination();
            if (result.success) {
                setCurrentGame(result.data);
            } else {
                setError(result.message || 'Failed to load game');
            }
        } catch (err) {
            setError(err.message || 'Failed to load game');
        } finally {
            setLoading(false);
        }
    };

    // Submit answer
    const answerQuestion = async (answerId) => {
        if (!currentGame) return;

        setLoading(true);
        setError(null);

        try {
            const result = await submitAnswer(currentGame.gameId, answerId);
            if (result.success) {
                setGameResult(result.data);

                // Update game stats if user is logged in
                if (user && result.data.userStats) {
                    setGameStats(result.data.userStats);
                    updateUser({
                        ...user,
                        gameStats: result.data.userStats
                    });
                }
            } else {
                setError(result.message || 'Failed to submit answer');
            }
        } catch (err) {
            setError(err.message || 'Failed to submit answer');
        } finally {
            setLoading(false);
        }
    };

    // Reset game
    const resetGame = () => {
        setCurrentGame(null);
        setGameResult(null);
        setError(null);
    };

    // Context value
    const value = {
        currentGame,
        gameResult,
        loading,
        error,
        gameStats,
        loadGame,
        answerQuestion,
        resetGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};