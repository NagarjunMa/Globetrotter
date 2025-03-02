import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import Game from './Game';
import { AuthContext } from '../context/AuthContext';
import { GameContext } from '../context/GameContext';

// Mock dependencies
jest.mock('react-toastify', () => ({
    toast: {
        warn: jest.fn(),
        error: jest.fn(),
        success: jest.fn()
    }
}));

jest.mock('../services/gameService', () => ({
    generateChallenge: jest.fn().mockResolvedValue({
        success: true,
        data: {
            challengeId: 'test-challenge-id',
            challengeLink: 'http://localhost:3000/challenge/test-challenge-id',
            username: 'testuser'
        }
    })
}));

// Mock child components to ensure specific text rendering
jest.mock('../components/game/AnswerOption', () => {
    return function MockAnswerOption({ answer, onClick, selected }) {
        return (
            <div
                data-testid={`answer-option-${answer.id}`}
                onClick={() => onClick(answer.id)}
            >
                {answer.name}
            </div>
        );
    };
});

describe('Game Component', () => {
    const mockCurrentGame = {
        gameId: 'game123',
        clues: [{ text: 'Clue 1' }, { text: 'Clue 2' }],
        answers: [
            { id: 'dest1', name: 'Paris', country: 'France' },
            { id: 'dest2', name: 'Tokyo', country: 'Japan' }
        ]
    };

    const mockGameStats = {
        totalGames: 5,
        correctAnswers: 3,
        incorrectAnswers: 2,
        score: 30
    };

    const renderGameWithContext = (gameContextOverrides = {}, authContextOverrides = {}) => {
        const defaultGameContext = {
            currentGame: mockCurrentGame,
            gameResult: null,
            loading: false,
            error: null,
            gameStats: mockGameStats,
            loadGame: jest.fn(),
            answerQuestion: jest.fn(),
            resetGame: jest.fn()
        };

        const defaultAuthContext = {
            user: { username: 'testuser' },
            isAuthenticated: true
        };

        return render(
            <AuthContext.Provider value={{ ...defaultAuthContext, ...authContextOverrides }}>
                <GameContext.Provider value={{ ...defaultGameContext, ...gameContextOverrides }}>
                    <Game />
                </GameContext.Provider>
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders game with clues and answers', () => {
        renderGameWithContext();

        expect(screen.getByText('Clue 1')).toBeInTheDocument();
        expect(screen.getByText('Clue 2')).toBeInTheDocument();
        expect(screen.getByTestId('answer-option-dest1')).toBeInTheDocument();
        expect(screen.getByTestId('answer-option-dest2')).toBeInTheDocument();
    });

    test('allows selecting an answer', () => {
        const mockAnswerQuestion = jest.fn();
        renderGameWithContext({ answerQuestion: mockAnswerQuestion });

        const parisOption = screen.getByTestId('answer-option-dest1');
        fireEvent.click(parisOption);

        const submitButton = screen.getByText('Submit Answer');
        fireEvent.click(submitButton);

        expect(mockAnswerQuestion).toHaveBeenCalledWith('dest1');
    });

    test('shows warning without answer selection', () => {
        renderGameWithContext();

        const submitButton = screen.getByText('Submit Answer');
        fireEvent.click(submitButton);

        expect(toast.warn).toHaveBeenCalledWith(expect.stringContaining('select an answer'));
    });
});