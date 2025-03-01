const { OpenAI } = require('openai');
const dotenv = require('dotenv/config');
const Destination = require('../models/Destination');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate new destinations using OpenAI
 * @param {number} count - Number of destinations to generate
 * @returns {Promise<Array>} - Array of destination objects
 */
exports.generateDestinations = async (count = 10) => {
  try {
    // Get existing destinations to avoid duplicates
    const existingDestinations = await Destination.find().select('name country');
    const existingCities = new Set(existingDestinations.map(dest => dest.name));
    
    const systemPrompt = `
    You are a travel expert and geography expert tasked with generating high-quality destination data for a travel guessing game.
    Each destination should include:
    1. A city name - MUST BE A REAL CITY
    2. The country it's in - MUST BE ACCURATE
    3. Continent - MUST BE ONE OF: Africa, Antarctica, Asia, Europe, North America, Oceania, South America
    4. 2-3 cryptic but accurate clues that hint at the destination without explicitly naming it
    5. 2-3 interesting fun facts about the destination
    6. 2-3 trivia items about the location
    
    Generate unique and diverse destinations from all continents. Focus on cities from these regions in order of priority:
    1. Asia (China, India, Japan, Southeast Asia, Central Asia)
    2. Africa (all regions)
    3. Europe (Eastern Europe, Scandinavia, Mediterranean)
    4. South America (all countries)
    5. North America (include Mexico, Caribbean, Central America)
    6. Oceania (Australia, New Zealand, Pacific Islands)
    
    DO NOT include these cities as they already exist: ${Array.from(existingCities).join(', ')}.
    
    Example format:
    {
      "name": "Kyoto",
      "country": "Japan",
      "continent": "Asia",
      "clues": [
        {"text": "This city was Japan's capital for over 1000 years before Tokyo.", "difficulty": "medium"},
        {"text": "Famous for its thousands of wooden temples and traditional gardens.", "difficulty": "medium"}
      ],
      "funFacts": [
        "This city has over 1,600 Buddhist temples and 400 Shinto shrines.",
        "It was removed from the atomic bomb target list during WWII due to its cultural significance."
      ],
      "trivia": [
        "The city's name means 'capital city' in Japanese.",
        "It's home to 17 UNESCO World Heritage Sites."
      ],
      "popularityScore": 8
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} unique tourist destinations in valid JSON format. Structure the response as a JSON array of destination objects. 
        Make sure to include destinations from different continents with emphasis on Asia, Africa, and less-known cities.
        IMPORTANT: 
        - Each clue must be an object with "text" and "difficulty" properties
        - All destinations must be real cities
        - All data must be factually accurate
        - No duplicates with existing cities: ${Array.from(existingCities).join(', ')}
        - Each continent must be exactly one of: Africa, Antarctica, Asia, Europe, North America, Oceania, South America` }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const responseText = response.choices[0].message.content;
    const parsedResponse = JSON.parse(responseText);
    
    // Process the destinations to ensure clues are in the correct format and continents are valid
    const destinations = parsedResponse.destinations || [];
    
    // Transform any string clues into objects with text and difficulty
    const processedDestinations = destinations.map(dest => {
      // Create a new object to avoid mutating the original
      const processedDest = {...dest};
      
      // If clues is an array of strings, convert each to an object
      if (Array.isArray(processedDest.clues)) {
        processedDest.clues = processedDest.clues.map(clue => {
          if (typeof clue === 'string') {
            return { text: clue, difficulty: 'medium' };
          }
          return clue;
        });
      }
      
      // Fix continent if it's not in the allowed enum values
      const validContinents = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
      if (!validContinents.includes(processedDest.continent)) {
        // If it's a combination like "Asia/Europe", choose the first one
        if (processedDest.continent && processedDest.continent.includes('/')) {
          processedDest.continent = processedDest.continent.split('/')[0].trim();
        } else {
          // Fallback to a reasonable continent based on country
          processedDest.continent = getContinentByCountry(processedDest.country) || 'Asia';
        }
      }
      
      return processedDest;
    });
    
    // Filter out any destinations that might still duplicate existing cities
    const filteredDestinations = processedDestinations.filter(dest => 
      !existingCities.has(dest.name)
    );
    
    return filteredDestinations;
  } catch (error) {
    console.error('Error generating destinations with AI:', error);
    throw new Error('Failed to generate destinations');
  }
};

/**
 * Enhance an existing destination with more clues and facts
 * @param {Object} destination - Existing destination object
 * @returns {Promise<Object>} - Enhanced destination object
 */
exports.enhanceDestination = async (destination) => {
  try {
    const systemPrompt = `
    You are a travel expert and geography expert tasked with enhancing destination data for a travel guessing game.
    You will be given an existing destination with some clues, fun facts, and trivia.
    Please add more clues, fun facts, and trivia to make the destination more interesting.
    
    Make sure added clues are cryptic but accurate and hint at the destination without explicitly naming it.
    Remember that clues must be objects with "text" and "difficulty" properties (difficulty can be "easy", "medium", or "hard").
    Fun facts should be interesting and surprising.
    Trivia should be educational and entertaining.
    
    Return the enhanced destination in the same format, keeping all existing data.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Enhance this destination with additional clues, fun facts, and trivia: ${JSON.stringify(destination)}` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const responseText = response.choices[0].message.content;
    const enhancedDestination = JSON.parse(responseText);
    
    // Ensure clues are in the correct format
    if (enhancedDestination.clues) {
      enhancedDestination.clues = enhancedDestination.clues.map(clue => {
        if (typeof clue === 'string') {
          return { text: clue, difficulty: 'medium' };
        }
        return clue;
      });
    }
    
    return enhancedDestination;
  } catch (error) {
    console.error('Error enhancing destination with AI:', error);
    // Return original destination if enhancement fails
    return destination;
  }
};

/**
 * Convert the starter dataset to the format used by our database
 * @param {Array} starterData - The starter dataset in the original format
 * @returns {Array} - Converted data in the format used by our database
 */
exports.convertStarterData = (starterData) => {
  return starterData.map(item => ({
    name: item.city,
    country: item.country,
    continent: getContinentByCountry(item.country), // Helper function to determine continent
    clues: item.clues.map(text => ({
      text,
      difficulty: 'medium'
    })),
    funFacts: item.fun_fact || [],
    trivia: item.trivia || [],
    popularityScore: getPopularityScore(item.city), // Helper function to assign popularity
  }));
};

/**
 * Simple helper to get continent by country
 * In a real application, you'd use a more comprehensive database
 */
function getContinentByCountry(country) {
  const continentMap = {
    'France': 'Europe',
    'Japan': 'Asia',
    'USA': 'North America',
    'China': 'Asia',
    'India': 'Asia',
    'Brazil': 'South America',
    'South Africa': 'Africa',
    'Australia': 'Oceania',
    'Russia': 'Europe',
    'Canada': 'North America',
    // Add more as needed
  };
  
  return continentMap[country] || 'Unknown';
}

/**
 * Simple helper to get popularity score for well-known cities
 * In a real application, you might use tourism statistics
 */
function getPopularityScore(city) {
  const popularCities = {
    'Paris': 9,
    'Tokyo': 8,
    'New York': 9,
    'London': 9,
    'Rome': 8,
    'Bangkok': 7,
    'Dubai': 8,
    'Singapore': 7,
    'Barcelona': 8,
    'Istanbul': 7,
    // Add more as needed
  };
  
  return popularCities[city] || Math.floor(Math.random() * 5) + 5; // Random score between 5-9
}