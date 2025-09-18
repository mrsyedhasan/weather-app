const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 999, // Leave 1 request buffer
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  resetTime: new Date().setHours(24, 0, 0, 0) // Reset at midnight
};

// In-memory storage for rate limiting (in production, use Redis)
let apiUsage = {
  requestCount: 0,
  lastReset: RATE_LIMIT_CONFIG.resetTime,
  requests: new Map() // Store requests with timestamps
};

// Cache for weather data (5 minutes)
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting and caching functions
function checkRateLimit() {
  const now = Date.now();
  
  // Reset counter at midnight
  if (now >= apiUsage.lastReset + RATE_LIMIT_CONFIG.windowMs) {
    apiUsage.requestCount = 0;
    apiUsage.lastReset = now;
    apiUsage.requests.clear();
    console.log('🔄 Rate limit reset at midnight');
  }
  
  return {
    allowed: apiUsage.requestCount < RATE_LIMIT_CONFIG.maxRequests,
    remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - apiUsage.requestCount),
    resetTime: apiUsage.lastReset + RATE_LIMIT_CONFIG.windowMs
  };
}

function incrementRequestCount() {
  apiUsage.requestCount++;
  apiUsage.requests.set(Date.now(), true);
  console.log(`📊 API requests used: ${apiUsage.requestCount}/${RATE_LIMIT_CONFIG.maxRequests}`);
}

function getCachedWeather(zipCode) {
  const cacheKey = `weather_${zipCode}`;
  const cached = weatherCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`💾 Cache hit for zip code: ${zipCode}`);
    return cached.data;
  }
  
  return null;
}

function setCachedWeather(zipCode, data) {
  const cacheKey = `weather_${zipCode}`;
  weatherCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  console.log(`💾 Cached weather for zip code: ${zipCode}`);
}

// Middleware
app.use(cors());
app.use(express.json());

// Weather API configuration
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API is running' });
});

// API usage endpoint
app.get('/api-usage', (req, res) => {
  const rateLimit = checkRateLimit();
  const nextReset = new Date(rateLimit.resetTime);
  
  res.json({
    requestsUsed: apiUsage.requestCount,
    requestsRemaining: rateLimit.remaining,
    maxRequests: RATE_LIMIT_CONFIG.maxRequests,
    resetTime: nextReset.toISOString(),
    cacheSize: weatherCache.size,
    status: rateLimit.allowed ? 'OK' : 'RATE_LIMITED'
  });
});

app.get('/weather/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    if (!zipCode || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      return res.status(400).json({ 
        error: 'Invalid zip code format. Please provide a valid US zip code.' 
      });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ 
        error: 'Weather API key not configured' 
      });
    }

    // Check cache first
    const cachedWeather = getCachedWeather(zipCode);
    if (cachedWeather) {
      return res.json({
        ...cachedWeather,
        cached: true,
        cacheTimestamp: new Date().toISOString()
      });
    }

    // Check rate limit
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime);
      return res.status(429).json({
        error: 'Daily API limit reached. Please try again tomorrow.',
        requestsUsed: apiUsage.requestCount,
        maxRequests: RATE_LIMIT_CONFIG.maxRequests,
        resetTime: resetTime.toISOString(),
        message: 'Rate limit exceeded. Weather data is cached for 5 minutes to reduce API calls.'
      });
    }

    // Get weather data from OpenWeatherMap API
    const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
      params: {
        zip: zipCode,
        appid: WEATHER_API_KEY,
        units: 'imperial' // Get temperature in Fahrenheit
      }
    });

    // Increment request count
    incrementRequestCount();

    const weatherData = {
      location: {
        name: response.data.name,
        country: response.data.sys.country,
        zipCode: zipCode
      },
      weather: {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      },
      temperature: {
        current: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        min: Math.round(response.data.main.temp_min),
        max: Math.round(response.data.main.temp_max)
      },
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      visibility: response.data.visibility / 1000, // Convert to km
      timestamp: new Date().toISOString(),
      cached: false,
      apiUsage: {
        requestsUsed: apiUsage.requestCount,
        requestsRemaining: RATE_LIMIT_CONFIG.maxRequests - apiUsage.requestCount
      }
    };

    // Cache the weather data
    setCachedWeather(zipCode, weatherData);

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ 
        error: 'Location not found. Please check the zip code.' 
      });
    } else if (error.response?.status === 401) {
      res.status(500).json({ 
        error: 'Invalid API key. Please check configuration.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch weather data. Please try again later.' 
      });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
