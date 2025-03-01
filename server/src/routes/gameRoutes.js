const express = require('express');
const router = express.Router();
const { 
  getRandomDestination,
  submitAnswer,
  generateChallenge
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Game routes
router.get('/destination', getRandomDestination);
router.post('/answer', submitAnswer);
router.post('/challenge', generateChallenge);

module.exports = router;