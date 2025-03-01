const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const { generateDestinations, convertStarterData } = require('./aiHelpers');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Starter dataset from the requirements
const starterData = [
  {
    "city": "Paris",
    "country": "France",
    "clues": [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art."
    ],
    "fun_fact": [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
    ],
    "trivia": [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia."
    ]
  },
  {
    "city": "Tokyo",
    "country": "Japan",
    "clues": [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming."
    ],
    "fun_fact": [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
    ],
    "trivia": [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies."
    ]
  },
  {
    "city": "New York",
    "country": "USA",
    "clues": [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters."
    ],
    "fun_fact": [
      "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
      "Times Square was once called Longacre Square before being renamed in 1904."
    ],
    "trivia": [
      "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
      "The Empire State Building has its own zip code: 10118."
    ]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if we already have destinations
    const existingCount = await Destination.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} destinations. Skipping seed.`);
      process.exit(0);
    }
    
    console.log('Converting starter data...');
    const convertedStarterData = convertStarterData(starterData);
    
    console.log('Importing starter data...'); 
    await Destination.insertMany(convertedStarterData);
    
    console.log('Generating additional destinations with AI...');
    // Calculate how many more destinations we need to reach 100+
    const remainingCount = 100 - convertedStarterData.length;
    
    // Generate in batches of 10 to avoid overloading the API
    const batchSize = 10;
    const batches = Math.ceil(remainingCount / batchSize);
    
    let generatedCount = 0;
    
    for (let i = 0; i < batches; i++) {
      const count = Math.min(batchSize, remainingCount - generatedCount);
      console.log(`Generating batch ${i + 1}/${batches} (${count} destinations)...`);
      
      try {
        const newDestinations = await generateDestinations(count);
        await Destination.insertMany(newDestinations);
        generatedCount += newDestinations.length;
        console.log(`Inserted ${newDestinations.length} new destinations. Total so far: ${convertedStarterData.length + generatedCount}`);
      } catch (error) {
        console.error(`Error in batch ${i + 1}:`, error);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const finalCount = await Destination.countDocuments();
    console.log(`Database seeded successfully with ${finalCount} destinations!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Execute the seed function
seedDatabase();