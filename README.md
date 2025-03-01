# Globetrotter Backend

This is the backend server for the Globetrotter travel guessing game. It provides APIs for user authentication, game mechanics, and destination management.

## Tech Stack

- Node.js with Express
- MongoDB with Mongoose
- OpenAI API for destination dataset expansion
- JWT for authentication

## Prerequisites

- Node.js (14.x or higher)
- MongoDB (local or Atlas)
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies

```bash
cd globetrotter/server
npm install
```

3. Configure environment variables
   - Copy `.env.example` to `.env` (or create a new `.env` file)
   - Fill in your MongoDB connection string and OpenAI API key

```bash
# Server configuration
PORT=5000
NODE_ENV=development

# MongoDB connection
MONGO_URI=mongodb://localhost:27017/globetrotter
# For production, use MongoDB Atlas connection string
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/globetrotter

# JWT Secret
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=30d

# OpenAI API Key (for dataset expansion)
OPENAI_API_KEY=your_openai_api_key
```

4. Seed the database with destinations

```bash
npm run seed
```

This command will:
- Import the starter dataset
- Use OpenAI to generate additional destinations
- You'll end up with 100+ destinations in the database

5. Start the server

```bash
npm run dev
```

The server will be running at http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (requires authentication)
- `GET /api/auth/stats/:username` - Get user stats by username

### Game

- `GET /api/game/destination` - Get a random destination with clues
- `POST /api/game/answer` - Submit an answer and check if it's correct
- `POST /api/game/challenge` - Generate a challenge link (requires authentication)

### Destinations (Admin Only)

- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Create a new destination
- `GET /api/destinations/:id` - Get a single destination
- `PUT /api/destinations/:id` - Update a destination
- `DELETE /api/destinations/:id` - Delete a destination
- `POST /api/destinations/import` - Import destinations in bulk

## Running Tests

```bash
npm test
```

## License

MIT