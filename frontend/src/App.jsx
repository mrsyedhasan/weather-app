import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Loader2 } from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [zipCode, setZipCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiUsage, setApiUsage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/weather/${zipCode}`);
      setWeatherData(response.data);
      
      // Update API usage info
      if (response.data.apiUsage) {
        setApiUsage(response.data.apiUsage);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError(`Rate limit exceeded: ${err.response.data.error}`);
        if (err.response.data.resetTime) {
          const resetTime = new Date(err.response.data.resetTime).toLocaleString();
          setError(prev => prev + ` Resets at: ${resetTime}`);
        }
      } else {
        setError(err.response?.data?.error || 'Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch API usage on component mount
  useEffect(() => {
    const fetchApiUsage = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api-usage`);
        setApiUsage(response.data);
      } catch (err) {
        console.error('Failed to fetch API usage:', err);
      }
    };
    
    fetchApiUsage();
  }, []);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🌤️ Weather App</h1>
          <p>Get the latest weather information by entering a US zip code</p>
        </header>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-group">
            <Search className="search-icon" />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter US zip code (e.g., 90210)"
              className="search-input"
              maxLength="10"
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading || !zipCode.trim()}
            >
              {loading ? <Loader2 className="spinner" data-testid="spinner" /> : 'Get Weather'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {weatherData && (
          <div className="weather-card">
            <div className="weather-header">
              <div className="location">
                <MapPin className="location-icon" />
                <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
                <p>ZIP: {weatherData.location.zipCode}</p>
              </div>
              <div className="weather-icon">
                <img 
                  src={getWeatherIcon(weatherData.weather.icon)} 
                  alt={weatherData.weather.description}
                />
                <p className="weather-description">
                  {weatherData.weather.description}
                </p>
              </div>
            </div>

            <div className="temperature-section">
              <div className="main-temp">
                <Thermometer className="temp-icon" />
                <span className="temp-value">{weatherData.temperature.current}°F</span>
              </div>
              <div className="temp-details">
                <p>Feels like {weatherData.temperature.feelsLike}°F</p>
                <p>High: {weatherData.temperature.max}°F | Low: {weatherData.temperature.min}°F</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <Droplets className="detail-icon" />
                <div>
                  <p className="detail-label">Humidity</p>
                  <p className="detail-value">{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="detail-item">
                <Wind className="detail-icon" />
                <div>
                  <p className="detail-label">Wind Speed</p>
                  <p className="detail-value">{weatherData.windSpeed} mph</p>
                </div>
              </div>
              <div className="detail-item">
                <Eye className="detail-icon" />
                <div>
                  <p className="detail-label">Visibility</p>
                  <p className="detail-value">{weatherData.visibility} km</p>
                </div>
              </div>
            </div>

            <div className="weather-footer">
              <p>Last updated: {formatTime(weatherData.timestamp)}</p>
            </div>
          </div>
        )}

        {apiUsage && (
          <div className="api-usage">
            <div className="usage-info">
              <span className="usage-label">API Usage:</span>
              <span className="usage-count">
                {apiUsage.requestsUsed || 0} / {apiUsage.maxRequests || 999}
              </span>
              <div className="usage-bar">
                <div 
                  className="usage-progress" 
                  style={{ 
                    width: `${((apiUsage.requestsUsed || 0) / (apiUsage.maxRequests || 999)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            {apiUsage.requestsRemaining !== undefined && (
              <p className="usage-remaining">
                {apiUsage.requestsRemaining} requests remaining today
              </p>
            )}
          </div>
        )}

        <footer className="footer">
          <p>Powered by OpenWeatherMap API</p>
          {weatherData?.cached && (
            <p className="cache-indicator">📦 Data from cache (5min)</p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default App;