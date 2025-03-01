import React from 'react';
import { FaTrophy, FaStar, FaExclamationCircle } from 'react-icons/fa';

const ScoreBoard = ({ stats }) => {
    const { totalGames, correctAnswers, incorrectAnswers, score } = stats;

    const accuracy = totalGames > 0
        ? Math.round((correctAnswers / totalGames) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-3">
                <h3 className="text-white font-bold">Your Stats</h3>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FaTrophy className="mx-auto text-yellow-500 mb-1" />
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-xs text-gray-500">Total Score</div>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <FaStar className="mx-auto text-green-500 mb-1" />
                    <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FaTrophy className="mx-auto text-blue-500 mb-1" />
                    <div className="text-2xl font-bold text-gray-700">{totalGames}</div>
                    <div className="text-xs text-gray-500">Games Played</div>
                </div>

                <div className="text-center p-3 bg-red-50 rounded-lg">
                    <FaExclamationCircle className="mx-auto text-red-500 mb-1" />
                    <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                    <div className="text-xs text-gray-500">Incorrect Answers</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreBoard;