const express = require('express');
const router = express.Router();
const { 
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  importDestinations
} = require('../controllers/destinationController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.route('/')
  .get(getDestinations)
  .post(createDestination);

router.route('/:id')
  .get(getDestination)
  .put(updateDestination)
  .delete(deleteDestination);

router.post('/import', importDestinations);

module.exports = router;