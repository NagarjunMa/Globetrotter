import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaMapMarked } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="max-w-md mx-auto text-center mt-8">
            <FaMapMarked className="text-8xl text-gray-300 mx-auto mb-4" />
            <FaGlobeAmericas className="text-5xl text-blue-500 mx-auto mb-6 -mt-12 ml-8" />

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                404 - Lost in Translation
            </h1>

            <p className="text-xl text-gray-600 mb-8">
                Seems like you've ventured into uncharted territory.
                This destination isn't on our map!
            </p>

            <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
                Return to Home
            </Link>
        </div>
    );
};

export default NotFound;