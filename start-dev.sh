#!/bin/bash

# Solar Power Prediction Development Startup Script
echo "🚀 Starting Solar Power Prediction Development Environment"
echo "=========================================================="

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed or not in PATH"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed or not in PATH"
    exit 1
fi

echo "✅ Python and Node.js are available"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd scripts
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi
cd ..

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

echo "✅ All dependencies installed successfully"

# Start Python ML server in background
echo "🐍 Starting Python ML server on port 8000..."
cd scripts
python solar_ml_server.py &
PYTHON_PID=$!
cd ..

# Wait a moment for the Python server to start
sleep 3

# Check if Python server is running
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "⚠️ Python ML server may not be running properly"
    echo "   You can start it manually with: cd scripts && python solar_ml_server.py"
fi

# Start Next.js development server
echo "⚛️ Starting Next.js development server on port 3000..."
npm run dev &
NEXTJS_PID=$!

echo ""
echo "🎉 Development environment started successfully!"
echo "================================================"
echo "📊 Python ML Server: http://localhost:8000"
echo "🌐 Next.js Frontend: http://localhost:3000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $PYTHON_PID 2>/dev/null
    kill $NEXTJS_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
