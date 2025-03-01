import React from 'react';
import { motion } from 'framer-motion';

const SadFaceAnimation = () => {
    return (
        <div className="relative w-24 h-24 mx-auto">
            {/* Face */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center"
            >
                {/* Eyes */}
                <div className="relative w-full h-full">
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, 3, 0] }}
                        transition={{ repeat: 2, duration: 1 }}
                        className="absolute left-4 top-5 w-2 h-2 bg-gray-800 rounded-full"
                    />
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, 3, 0] }}
                        transition={{ repeat: 2, duration: 1, delay: 0.1 }}
                        className="absolute right-4 top-5 w-2 h-2 bg-gray-800 rounded-full"
                    />

                    {/* Mouth */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-5 overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: -2 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="w-10 h-10 border-2 border-gray-800 rounded-full -mt-8"
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Tears */}
            <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 15, opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatType: "loop" }}
                className="absolute left-4 top-7 w-1.5 h-4 bg-blue-400 rounded-full"
            />
            <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 15, opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.7, repeatType: "loop" }}
                className="absolute right-4 top-7 w-1.5 h-4 bg-blue-400 rounded-full"
            />
        </div>
    );
};

export default SadFaceAnimation;