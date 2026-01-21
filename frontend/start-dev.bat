@echo off
REM Chandni Jewellery - Windows Quick Start Script
REM This script sets up and starts both backend and frontend

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Chandni Jewellery - Quick Start Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Download Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo ✓ npm found:
npm --version
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠ WARNING: MongoDB is not running locally
    echo.
    echo Options:
    echo 1. Start MongoDB Community Server (Windows Services)
    echo 2. Use MongoDB Atlas cloud (update .env MONGO_URI)
    echo.
    set /p mongodb_choice="Continue with MongoDB Atlas? (y/n): "
    if /i not "!mongodb_choice!"=="y" (
        echo.
        echo Starting MongoDB...
        start mongod
        timeout /t 3 >nul
    )
) else (
    echo ✓ MongoDB is running
    echo.
)

REM Setup Backend
echo ========================================
echo Setting up Backend...
echo ========================================
echo.

cd /d "%~dp0\Chandni-Jewellery-Backend-main" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found
    echo Expected: %~dp0\Chandni-Jewellery-Backend-main
    pause
    exit /b 1
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Checking for .env file...
if not exist ".env" (
    echo ERROR: .env file not found in backend directory
    echo Please create .env with required environment variables
    echo Reference: INSTALLATION.md
    pause
    exit /b 1
)

echo ✓ Backend ready
echo.

REM Setup Frontend
echo ========================================
echo Setting up Frontend...
echo ========================================
echo.

cd /d "%~dp0\MFCJ"
if %errorlevel% neq 0 (
    echo ERROR: Frontend directory not found
    echo Expected: %~dp0\MFCJ
    pause
    exit /b 1
)

echo Installing frontend dependencies (optional)...
call npm install
echo ✓ Frontend ready
echo.

REM Start Services
echo ========================================
echo Starting Services...
echo ========================================
echo.

echo.
echo Opening new terminals for backend and frontend...
echo.

REM Start Backend in new terminal
echo Starting Backend on http://localhost:5000
start cmd /k "cd /d "%~dp0\Chandni-Jewellery-Backend-main" && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 >nul

REM Start Frontend development server
echo Starting Frontend on http://localhost:8000
start cmd /k "cd /d "%~dp0\MFCJ" && python -m http.server 8000"

echo.
echo ========================================
echo ✓ Services Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:8000
echo.
echo Default Test Accounts:
echo   User:  john@example.com / User@123
echo   Admin: admin@chandni.com / Admin@123
echo.
echo Press any key to exit this window...
pause >nul
