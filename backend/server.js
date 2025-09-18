const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

    // Get weather data from OpenWeatherMap API
    const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
      params: {
        zip: zipCode,
        appid: WEATHER_API_KEY,
        units: 'imperial' // Get temperature in Fahrenheit
      }
    });

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
      timestamp: new Date().toISOString()
    };

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
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
