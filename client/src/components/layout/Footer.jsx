import React from 'react';
import { FaGlobeAmericas, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <FaGlobeAmericas className="text-2xl mr-2 text-blue-400" />
                        <span className="text-lg font-bold">Globetrotter</span>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="flex items-center justify-center md:justify-end">
                            Made with <FaHeart className="text-red-500 mx-1" /> by Travel Enthusiasts
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            &copy; {new Date().getFullYear()} Globetrotter. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;