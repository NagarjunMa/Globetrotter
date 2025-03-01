const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters'],
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  gameStats: {
    totalGames: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    incorrectAnswers: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  recentGames: [{
    destinationId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Destination',
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update game stats
UserSchema.methods.updateGameStats = function (destinationId, correct) {
  // Update total games, correct/incorrect answers, and score
  this.gameStats.totalGames += 1;
  
  if (correct) {
    this.gameStats.correctAnswers += 1;
    this.gameStats.score += 10; // Award 10 points for correct answer
  } else {
    this.gameStats.incorrectAnswers += 1;
  }
  
  // Add to recent games (limited to 10)
  this.recentGames.unshift({
    destinationId,
    correct,
    playedAt: Date.now(),
  });
  
  // Keep only the 10 most recent games
  if (this.recentGames.length > 10) {
    this.recentGames = this.recentGames.slice(0, 10);
  }
  
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);