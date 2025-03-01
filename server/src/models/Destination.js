const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a destination name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  country: {
    type: String,
    required: [true, 'Please add a country'],
    trim: true,
  },
  continent: {
    type: String,
    required: [true, 'Please add a continent'],
    enum: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'],
  },
  clues: [{
    text: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    }
  }],
  funFacts: [
    {
      type: String,
      required: true,
    }
  ],
  trivia: [
    {
      type: String,
    }
  ],
  imageURL: {
    type: String,
    match: [
      /^(http|https):\/\/[^ "]+$/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  },
  popularityScore: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must not be more than 10'],
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create text index for search functionality
DestinationSchema.index({ name: 'text', country: 'text' });

// Middleware to update the updatedAt field on save
DestinationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Destination', DestinationSchema);