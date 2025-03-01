import React from 'react';
import { FaGlobeAmericas, FaLightbulb } from 'react-icons/fa';

const GameCard = ({ clues }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex items-center">
                <FaGlobeAmericas className="text-white text-3xl mr-3" />
                <h2 className="text-white text-xl font-bold">Where in the World?</h2>
            </div>

            <div className="p-6">
                <p className="text-gray-600 mb-4">Guess the destination based on these clues:</p>

                {clues && clues.map((clue, index) => (
                    <div key={index} className="clue-card">
                        <div className="flex items-start">
                            <FaLightbulb className="text-yellow-500 mt-1 mr-3 text-xl" />
                            <div>
                                <p className="text-gray-800 font-medium">{clue.text}</p>
                                <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                    {clue.difficulty === 'easy' ? 'Easy' : clue.difficulty === 'hard' ? 'Hard' : 'Medium'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameCard;