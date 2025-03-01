const Destination = require('../models/Destination');
const { ErrorResponse } = require('../utils/errorHandler');

/**
 * @desc    Get all destinations
 * @route   GET /api/destinations
 * @access  Private
 */
exports.getDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find().select('name country continent');
    
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destinations'
    });
  }
};

/**
 * @desc    Get single destination
 * @route   GET /api/destinations/:id
 * @access  Private
 */
exports.getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destination'
    });
  }
};

/**
 * @desc    Create new destination
 * @route   POST /api/destinations
 * @access  Private
 */
exports.createDestination = async (req, res, next) => {
  try {
    // Create destination
    const destination = await Destination.create(req.body);
    
    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A destination with this name already exists'
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields in the correct format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create destination'
    });
  }
};

/**
 * @desc    Update destination
 * @route   PUT /api/destinations/:id
 * @access  Private
 */
exports.updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid field values'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update destination'
    });
  }
};

/**
 * @desc    Delete destination
 * @route   DELETE /api/destinations/:id
 * @access  Private
 */
exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    await destination.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete destination'
    });
  }
};

/**
 * @desc    Import destinations in bulk
 * @route   POST /api/destinations/import
 * @access  Private
 */
exports.importDestinations = async (req, res, next) => {
  try {
    const { destinations } = req.body;
    
    if (!destinations || !Array.isArray(destinations)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of destinations'
      });
    }
    
    const importedDestinations = await Destination.insertMany(destinations, { 
      ordered: false // Continue processing even if some documents fail
    });
    
    res.status(201).json({
      success: true,
      count: importedDestinations.length,
      data: importedDestinations
    });
  } catch (err) {
    // Handle bulk write errors
    if (err.code === 11000) {
      return res.status(207).json({
        success: true,
        message: 'Some destinations were imported, but duplicates were skipped',
        insertedCount: err.result ? err.result.nInserted : 0
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to import destinations'
    });
  }
};