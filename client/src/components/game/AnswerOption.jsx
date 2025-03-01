import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaCircle } from 'react-icons/fa';

const AnswerOption = ({
    answer,
    selected,
    isCorrect,
    isRevealed,
    onClick
}) => {
    const getIcon = () => {
        if (!isRevealed) {
            return selected ?
                <FaCircle className="text-primary-500 mr-3" /> :
                <FaCircle className="text-gray-300 mr-3" />;
        }

        if (isCorrect) {
            return <FaCheckCircle className="text-green-500 mr-3" />;
        }

        if (selected && !isCorrect) {
            return <FaTimesCircle className="text-red-500 mr-3" />;
        }

        return <FaCircle className="text-gray-300 mr-3" />;
    };

    const getClassName = () => {
        let classes = "answer-option";

        if (selected && !isRevealed) {
            classes += " selected";
        }

        if (isRevealed) {
            if (isCorrect) {
                classes += " correct";
            } else if (selected && !isCorrect) {
                classes += " incorrect";
            }
        }

        return classes;
    };

    return (
        <div
            className={getClassName()}
            onClick={() => !isRevealed && onClick(answer.id)}
        >
            {getIcon()}
            <div>
                <h3 className="font-medium text-gray-800">{answer.name}</h3>
                <p className="text-sm text-gray-500">{answer.country}</p>
            </div>
        </div>
    );
};

export default AnswerOption;