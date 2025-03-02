# Globetrotter Challenge

A full-stack web application that challenges users to guess famous destinations based on cryptic clues.

## Project Structure

```
globetrotter/
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   ├── middleware/     # Custom middleware
│   │   ├── app.js          # Express app
│   │   └── server.js       # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── game/       # Game-related components
│   │   │   ├── layout/     # Layout components
│   │   │   └── common/     # Common components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md
```

## Core Features

- User authentication and profile management
- Random destination selection with cryptic clues
- Multiple-choice destination guessing
- Score tracking and game statistics
- Social sharing for challenging friends
- 100+ destinations from around the world

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- OpenAI API for dataset expansion

### Frontend
- React
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests
- Framer Motion for animations

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- OpenAI API key (for dataset expansion)

### Backend Setup
1. Navigate to server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=8080
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Seed the database: `npm run seed`
5. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to client directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```
4. Start development server: `npm start`

## Deployment

### Deploy Backend (Render)
1. Create a Web Service on Render
2. Use build command: `npm install`
3. Use start command: `node src/server.js`
4. Add environment variables as listed in backend setup

### Deploy Frontend (Render)
1. Create a Static Site on Render
2. Use build command: `npm install && npm run build`
3. Set publish directory to: `build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`

## Testing

Run backend tests: `cd server && npm test`
Run frontend tests: `cd client && npm test`