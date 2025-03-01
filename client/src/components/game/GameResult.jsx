import React, { useState, useEffect } from 'react';
import { FaTrophy, FaLightbulb } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import SadFaceAnimation from './SadFaceAnimation';

const GameResult = ({ result, onPlayAgain, onChallenge }) => {
    const { correct, correctAnswer, funFact } = result;
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                {correct && (
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        numberOfPieces={300}
                        recycle={false}
                        colors={['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899']}
                        gravity={0.15}
                    />
                )}

                <div className={`px-6 py-4 flex items-center ${correct ? 'bg-green-500' : 'bg-red-500'}`}>
                    {correct ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                            transition={{
                                scale: { duration: 0.6 },
                                rotate: {
                                    duration: 0.6,
                                    times: [0, 0.33, 0.66, 1],
                                    ease: "easeInOut"
                                }
                            }}
                            className="mr-3"
                        >
                            <FaTrophy className="text-white text-3xl" />
                        </motion.div>
                    ) : (
                        <div className="mr-3">
                            <SadFaceAnimation />
                        </div>
                    )}
                    <motion.h2
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-white text-xl font-bold"
                    >
                        {correct ? 'Correct Answer!' : 'Not Quite Right'}
                    </motion.h2>
                </div>

                <div className="p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-4"
                    >
                        <h3 className="font-bold text-lg text-gray-800">
                            {correctAnswer.name}, {correctAnswer.country}
                        </h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-blue-50 p-4 rounded-lg mb-6 flex"
                    >
                        <FaLightbulb className="text-yellow-500 text-xl mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{funFact}</p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onPlayAgain}
                            className="btn btn-primary w-full sm:w-auto sm:flex-1"
                        >
                            Play Again
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onChallenge}
                            className="btn btn-outline w-full sm:w-auto sm:flex-1"
                        >
                            Challenge a Friend
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameResult;