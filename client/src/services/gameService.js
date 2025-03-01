import api from './api';

// Get a random destination for the game
export const getRandomDestination = async () => {
  try {
    const response = await api.get('/game/destination');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get destination' };
  }
};

// Submit an answer for the game
export const submitAnswer = async (gameId, answerId) => {
  try {
    const response = await api.post('/game/answer', { gameId, answerId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to submit answer' };
  }
};

// Generate a challenge link to share with friends
export const generateChallenge = async () => {
  try {
    const response = await api.post('/game/challenge');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to generate challenge' };
  }
};