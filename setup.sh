#!/bin/bash

# Weather App Setup Script
echo "🌤️  Setting up Weather App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment files
echo "🔧 Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please add your OpenWeatherMap API key to backend/.env"
else
    echo "✅ backend/.env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cp frontend/env.example frontend/.env
    echo "✅ Created frontend/.env file"
else
    echo "✅ frontend/.env already exists"
fi

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed"

# Run tests to verify setup
echo "🧪 Running tests to verify setup..."
npm run backend:test

if [ $? -ne 0 ]; then
    echo "⚠️  Backend tests failed, but setup continues..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your OpenWeatherMap API key from https://openweathermap.org/api"
echo "2. Add it to backend/.env file: OPENWEATHER_API_KEY=your_key_here"
echo "3. Start the development servers: npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🌤️"
