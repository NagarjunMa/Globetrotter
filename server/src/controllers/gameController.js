const Destination = require('../models/Destination');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');

/**
 * @desc    Get a random destination with clues for the game
 * @route   GET /api/game/destination
 * @access  Private
 */
exports.getRandomDestination = async (req, res, next) => {
  try {
    // Count total destinations
    const count = await Destination.countDocuments();
    
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No destinations available'
      });
    }
    
    // Get a random destination
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);
    
    // Get 3 more random destinations for multiple choice options
    const otherDestinations = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } },
      { $project: { name: 1, country: 1 } }
    ]);
    
    // Choose random clues (1-2 clues)
    const numClues = Math.min(Math.floor(Math.random() * 2) + 1, destination.clues.length);
    const randomClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, numClues);
    
    // Choose a random fun fact to display after answering
    const randomFunFactIndex = Math.floor(Math.random() * destination.funFacts.length);
    const funFact = destination.funFacts[randomFunFactIndex];
    
    // Create answers array with correct destination and decoys
    const answers = [
      {
        id: destination._id,
        name: destination.name,
        country: destination.country
      },
      ...otherDestinations.map(dest => ({
        id: dest._id,
        name: dest.name,
        country: dest.country
      }))
    ];
    
    // Shuffle answers
    answers.sort(() => 0.5 - Math.random());
    
    res.status(200).json({
      success: true,
      data: {
        gameId: destination._id,
        clues: randomClues,
        answers,
        funFact,
        // Don't send the correct answer in the response
        correctAnswerId: undefined
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving game data'
    });
  }
};

/**
 * @desc    Submit an answer for the game
 * @route   POST /api/game/answer
 * @access  Private
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const { gameId, answerId } = req.body;
    
    if (!gameId || !answerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide gameId and answerId'
      });
    }
    
    // Find the destination (correct answer)
    const destination = await Destination.findById(gameId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Invalid game ID'
      });
    }
    
    // Check if the answer is correct
    const isCorrect = destination._id.toString() === answerId;
    
    // Choose a random fun fact to display
    const randomFunFactIndex = Math.floor(Math.random() * destination.funFacts.length);
    const funFact = destination.funFacts[randomFunFactIndex];
    
    // Update user stats
    await req.user.updateGameStats(destination._id, isCorrect);
    
    res.status(200).json({
      success: true,
      data: {
        correct: isCorrect,
        correctAnswer: {
          id: destination._id,
          name: destination.name,
          country: destination.country
        },
        funFact,
        userStats: req.user.gameStats
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error processing your answer'
    });
  }
};

/**
 * @desc    Generate a challenge link
 * @route   POST /api/game/challenge
 * @access  Private
 */
exports.generateChallenge = async (req, res, next) => {
  try {
    const { username } = req.user;
    
    // Generate a unique challenge ID
    const challengeId = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    
    // Return challenge details
    res.status(200).json({
      success: true,
      data: {
        challengeId,
        challengeLink: `${req.protocol}://${req.get('host')}/challenge/${challengeId}`,
        username,
        stats: req.user.gameStats
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error generating challenge'
    });
  }
};