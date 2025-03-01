# Globetrotter Backend Documentation

## Overview

Globetrotter is a full-stack web application that challenges users to guess famous destinations based on cryptic clues. The backend is built with Node.js, Express, and MongoDB, providing the necessary APIs for user authentication, game mechanics, and destination management.

## Table of Contents

- [System Architecture](#system-architecture)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Game Mechanics](#game-mechanics)
- [Deployment](#deployment)
- [Development and Testing](#development-and-testing)

## System Architecture

### Tech Stack

- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for storing destinations, users, and game data
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **OpenAI API**: Used to expand the destination dataset

### Project Structure

```
server/
├── src/
│   ├── config/             # Configuration files
│   │   └── db.js           # Database connection
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── destinationController.js
│   │   └── gameController.js
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   └── Destination.js
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js
│   │   ├── destinationRoutes.js
│   │   └── gameRoutes.js
│   ├── utils/              # Helper functions
│   │   ├── errorHandler.js
│   │   ├── aiHelpers.js
│   │   └── seedDatabase.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── app.js              # Express app
│   └── server.js           # Server entry point
├── .env                    # Environment variables
└── package.json
```

## API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**: (201 Created)
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "data": {
      "id": "user_id",
      "username": "string",
      "gameStats": {
        "totalGames": 0,
        "correctAnswers": 0,
        "incorrectAnswers": 0,
        "score": 0
      }
    }
  }
  ```
- **Error Response**: (400 Bad Request)
  ```json
  {
    "success": false,
    "message": "Username is already taken, please choose another"
  }
  ```

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "data": {
      "id": "user_id",
      "username": "string",
      "gameStats": {
        "totalGames": 0,
        "correctAnswers": 0,
        "incorrectAnswers": 0,
        "score": 0
      }
    }
  }
  ```
- **Error Response**: (401 Unauthorized)
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

#### Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "username": "string",
      "gameStats": {
        "totalGames": 0,
        "correctAnswers": 0,
        "incorrectAnswers": 0,
        "score": 0
      },
      "recentGames": [],
      "createdAt": "2023-05-23T00:00:00.000Z"
    }
  }
  ```
- **Error Response**: (401 Unauthorized)
  ```json
  {
    "success": false,
    "message": "Not authorized"
  }
  ```

#### Get User Stats
- **URL**: `/api/auth/stats/:username`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      "username": "string",
      "stats": {
        "totalGames": 0,
        "correctAnswers": 0,
        "incorrectAnswers": 0,
        "score": 0
      },
      "createdAt": "2023-05-23T00:00:00.000Z"
    }
  }
  ```
- **Error Response**: (404 Not Found)
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

### Game Endpoints

#### Get Random Destination
- **URL**: `/api/game/destination`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      "gameId": "destination_id",
      "clues": [
        {
          "text": "This city is home to a famous tower that sparkles every night.",
          "difficulty": "medium"
        }
      ],
      "answers": [
        {
          "id": "destination_id_1",
          "name": "Paris",
          "country": "France"
        },
        {
          "id": "destination_id_2",
          "name": "Tokyo",
          "country": "Japan"
        },
        // two more options...
      ],
      "funFact": "Paris has only one stop sign in the entire city!"
    }
  }
  ```
- **Error Response**: (404 Not Found)
  ```json
  {
    "success": false,
    "message": "No destinations available"
  }
  ```

#### Submit Answer
- **URL**: `/api/game/answer`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Body**:
  ```json
  {
    "gameId": "destination_id",
    "answerId": "answer_destination_id"
  }
  ```
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      "correct": true,
      "correctAnswer": {
        "id": "destination_id",
        "name": "Paris",
        "country": "France"
      },
      "funFact": "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "userStats": {
        "totalGames": 1,
        "correctAnswers": 1,
        "incorrectAnswers": 0,
        "score": 10
      }
    }
  }
  ```
- **Error Response**: (400 Bad Request)
  ```json
  {
    "success": false,
    "message": "Please provide gameId and answerId"
  }
  ```

#### Generate Challenge
- **URL**: `/api/game/challenge`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      "challengeId": "unique_challenge_id",
      "challengeLink": "http://yourdomain.com/challenge/unique_challenge_id",
      "username": "challenger_username",
      "stats": {
        "totalGames": 10,
        "correctAnswers": 8,
        "incorrectAnswers": 2,
        "score": 80
      }
    }
  }
  ```
- **Error Response**: (401 Unauthorized)
  ```json
  {
    "success": false,
    "message": "Not authorized"
  }
  ```

### Destination Endpoints (Admin Only)

#### Get All Destinations
- **URL**: `/api/destinations`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "count": 100,
    "data": [
      {
        "_id": "destination_id",
        "name": "Paris",
        "country": "France",
        "continent": "Europe"
      },
      // more destinations...
    ]
  }
  ```

#### Get Single Destination
- **URL**: `/api/destinations/:id`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      "_id": "destination_id",
      "name": "Paris",
      "country": "France",
      "continent": "Europe",
      "clues": [
        {
          "text": "This city is home to a famous tower that sparkles every night.",
          "difficulty": "medium"
        }
      ],
      "funFacts": [
        "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!"
      ],
      "trivia": [
        "Paris was originally a Roman city called Lutetia."
      ],
      "popularityScore": 9,
      "createdAt": "2023-05-23T00:00:00.000Z",
      "updatedAt": "2023-05-23T00:00:00.000Z"
    }
  }
  ```

#### Create Destination
- **URL**: `/api/destinations`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Body**: Destination object
- **Success Response**: (201 Created)
  ```json
  {
    "success": true,
    "data": {
      // created destination object
    }
  }
  ```

#### Update Destination
- **URL**: `/api/destinations/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (JWT Token)
- **Body**: Updated destination fields
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {
      // updated destination object
    }
  }
  ```

#### Delete Destination
- **URL**: `/api/destinations/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: (200 OK)
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

#### Import Destinations in Bulk
- **URL**: `/api/destinations/import`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Body**:
  ```json
  {
    "destinations": [
      // array of destination objects
    ]
  }
  ```
- **Success Response**: (201 Created)
  ```json
  {
    "success": true,
    "count": 10,
    "data": [
      // array of imported destinations
    ]
  }
  ```

## Database Schema

### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
    minlength: 3
  },
  email: {
    type: String,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  gameStats: {
    totalGames: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  },
  recentGames: [{
    destinationId: {
      type: ObjectId,
      ref: 'Destination',
      required: true
    },
    correct: {
      type: Boolean,
      required: true
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Destination Model

```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  continent: {
    type: String,
    required: true,
    enum: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
  },
  clues: [{
    text: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  funFacts: [{
    type: String,
    required: true
  }],
  trivia: [{
    type: String
  }],
  imageURL: {
    type: String,
    match: /^(http|https):\/\/[^ "]+$/
  },
  popularityScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## Authentication Flow

1. **Registration**:
   - User submits username and password
   - Password is hashed using bcrypt
   - User is created in the database
   - JWT token is generated and returned

2. **Login**:
   - User submits username and password
   - Password is compared with the stored hash
   - JWT token is generated and returned

3. **Authorization**:
   - JWT token is sent in the Authorization header as a Bearer token
   - Token is verified using the JWT secret
   - User is attached to the request object

4. **Token Expiration**:
   - Tokens expire after the time specified in JWT_EXPIRE
   - Users must log in again when their token expires

## Game Mechanics

1. **Destination Selection**:
   - Random destination is selected from the database
   - 1-2 random clues are selected from the destination
   - 3 incorrect destinations are selected for multiple choice

2. **Answer Submission**:
   - User submits their answer
   - Answer is checked against the correct destination
   - User's stats are updated based on correctness
   - Fun fact and result are returned

3. **Challenge System**:
   - User can generate a challenge link
   - Challenge includes user's stats
   - Other users can access the challenge via the link

## Deployment

### Environment Variables

```
PORT=5000
NODE_ENV=development|production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/globetrotter
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Seeding the Database

```bash
npm run seed
```

## Development and Testing

### Prerequisites

- Node.js (14.x or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Seed the database: `npm run seed`
5. Start the development server: `npm run dev`

### Testing

Unit tests are available for all major components:

```bash
npm test
```

For manual testing, use Postman or any API testing tool to interact with the endpoints.

## Additional Notes

- The OpenAI API is used to expand the destination dataset beyond the initial starter set
- The database is designed to support over 100 destinations
- Game statistics are tracked per user
- The system uses MongoDB text indexes for efficient searching