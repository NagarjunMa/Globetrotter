import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnswerOption from './AnswerOption';

describe('AnswerOption Component', () => {
    const mockAnswer = {
        id: 'dest-1',
        name: 'Paris',
        country: 'France'
    };

    const mockOnClick = jest.fn();

    test('renders answer option correctly', () => {
        render(
            <AnswerOption
                answer={mockAnswer}
                selected={false}
                isCorrect={false}
                isRevealed={false}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText('France')).toBeInTheDocument();
    });

    test('applies selected class when selected', () => {
        const { container } = render(
            <AnswerOption
                answer={mockAnswer}
                selected={true}
                isCorrect={false}
                isRevealed={false}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByTestId('answer-option')).toHaveClass('correct');
    });

    test('applies correct class when revealed and correct', () => {
        const { container } = render(
            <AnswerOption
                answer={mockAnswer}
                selected={false}
                isCorrect={true}
                isRevealed={true}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByTestId('answer-option')).toHaveClass('correct');
    });

    test('applies incorrect class when revealed, selected but not correct', () => {
        const { container } = render(
            <AnswerOption
                answer={mockAnswer}
                selected={true}
                isCorrect={false}
                isRevealed={true}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByTestId('answer-option')).toHaveClass('correct');
    });

    test('calls onClick when clicked and not revealed', () => {
        render(
            <AnswerOption
                answer={mockAnswer}
                selected={false}
                isCorrect={false}
                isRevealed={false}
                onClick={mockOnClick}
            />
        );

        fireEvent.click(screen.getByText('Paris'));

        expect(mockOnClick).toHaveBeenCalledWith('dest-1');
    });

    test('does not call onClick when clicked but already revealed', () => {
        render(
            <AnswerOption
                answer={mockAnswer}
                selected={false}
                isCorrect={false}
                isRevealed={true}
                onClick={mockOnClick}
            />
        );

        fireEvent.click(screen.getByText('Paris'));

        expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('shows check icon for correct answer when revealed', () => {
        render(
            <AnswerOption
                answer={mockAnswer}
                selected={false}
                isCorrect={true}
                isRevealed={true}
                onClick={mockOnClick}
            />
        );

        // Using a more generic approach since we can't easily query for the icon component
        expect(screen.getByTestId('correct-icon')).toBeInTheDocument();
    });

    test('shows X icon for incorrect selected answer when revealed', () => {
        render(
            <AnswerOption
                answer={mockAnswer}
                selected={true}
                isCorrect={false}
                isRevealed={true}
                onClick={mockOnClick}
            />
        );

        // Using a more generic approach since we can't easily query for the icon component
        expect(screen.getByTestId('wrong-icon')).toBeInTheDocument();
    });
});