# 🌤️ Weather App

A modern, responsive weather application built with React and Node.js. Get real-time weather information for any US zip code with a beautiful, mobile-friendly interface.

## ✨ Features

- **Real-time Weather Data**: Get current weather conditions using OpenWeatherMap API
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Zip Code Search**: Enter any US zip code to get weather information
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Error Handling**: Comprehensive error handling and validation
- **Testing**: Full test coverage with Playwright integration tests
- **CI/CD**: Automated testing and deployment with GitHub Actions

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/weather-app) (Replace with your GitHub Pages URL)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client for external API calls
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Testing
- **Playwright** - End-to-end testing
- **Jest** - Unit testing framework
- **Supertest** - HTTP assertion library

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Free hosting
- **Concurrently** - Run multiple processes

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Set Up Environment Variables

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `.env` file:
```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
PORT=3001
```

#### Frontend (.env)
```bash
cd frontend
cp env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

### 5. Open Your Browser

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Backend Tests Only
```bash
npm run backend:test
```

### Run Frontend Tests Only
```bash
npm run frontend:test
```

## 📁 Project Structure

```
weather-app/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── backend/
│   ├── tests/
│   │   └── server.test.js         # Backend unit tests
│   ├── server.js                  # Express server
│   ├── package.json
│   └── env.example               # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── App.css               # Styles
│   │   └── main.jsx              # React entry point
│   ├── package.json
│   └── env.example               # Environment variables template
├── tests/
│   └── weather-app.spec.js       # Playwright integration tests
├── playwright.config.js          # Playwright configuration
├── package.json                  # Root package.json with scripts
└── README.md
```

## 🔧 API Endpoints

### Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/weather/:zipCode` | Get weather data for zip code |

### Example API Response

```json
{
  "location": {
    "name": "Beverly Hills",
    "country": "US",
    "zipCode": "90210"
  },
  "weather": {
    "main": "Clear",
    "description": "clear sky",
    "icon": "01d"
  },
  "temperature": {
    "current": 72,
    "feelsLike": 75,
    "min": 65,
    "max": 78
  },
  "humidity": 45,
  "windSpeed": 5.2,
  "visibility": 10,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Deployment

### GitHub Pages (Free Hosting)

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **Set Environment Variables**:
   - Go to repository settings
   - Navigate to "Secrets and variables" > "Actions"
   - Add `OPENWEATHER_API_KEY` secret

3. **Deploy**:
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

### Other Hosting Options

- **Vercel**: Connect your GitHub repository
- **Netlify**: Connect your GitHub repository
- **Heroku**: Add buildpacks for Node.js and static files
- **Railway**: Deploy with zero configuration

## 🔑 Getting OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" section
4. Copy your API key
5. Add it to your `.env` file

**Note**: Free tier includes 1,000 API calls per day.

## 🧪 Test Coverage

The project includes comprehensive testing:

- **Unit Tests**: Backend API endpoints
- **Integration Tests**: Full user workflows
- **E2E Tests**: Cross-browser compatibility
- **API Tests**: Backend health and error handling
- **UI Tests**: Form validation and responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run build` | Build frontend for production |
| `npm start` | Start backend in production mode |
| `npm test` | Run all Playwright tests |
| `npm run test:ui` | Run tests with Playwright UI |
| `npm run test:headed` | Run tests in headed mode |
| `npm run install:all` | Install all dependencies |
| `npm run backend:test` | Run backend unit tests |
| `npm run frontend:test` | Run frontend tests |

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Make sure you've set the `OPENWEATHER_API_KEY` in your `.env` file
2. **CORS Issues**: Ensure the frontend is running on the correct port (5173)
3. **Port Conflicts**: Check if ports 3001 and 5173 are available
4. **Build Errors**: Run `npm run install:all` to ensure all dependencies are installed

### Getting Help

- Check the [Issues](https://github.com/your-username/weather-app/issues) page
- Review the test files for usage examples
- Check the browser console for error messages

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vite](https://vitejs.dev/) for fast development
- [Playwright](https://playwright.dev/) for testing

---

**Happy Weather Tracking! 🌤️**
