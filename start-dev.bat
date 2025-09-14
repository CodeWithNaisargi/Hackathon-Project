@echo off
REM Solar Power Prediction Development Startup Script for Windows
echo 🚀 Starting Solar Power Prediction Development Environment
echo ==========================================================

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Python and Node.js are available

REM Install Python dependencies
echo 📦 Installing Python dependencies...
cd scripts
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo ✅ All dependencies installed successfully

REM Start Python ML server in background
echo 🐍 Starting Python ML server on port 8000...
cd scripts
start "Python ML Server" cmd /k "python solar_ml_server.py"
cd ..

REM Wait a moment for the Python server to start
timeout /t 3 /nobreak >nul

REM Start Next.js development server
echo ⚛️ Starting Next.js development server on port 3000...
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo 🎉 Development environment started successfully!
echo ================================================
echo 📊 Python ML Server: http://localhost:8000
echo 🌐 Next.js Frontend: http://localhost:3000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.
pause
