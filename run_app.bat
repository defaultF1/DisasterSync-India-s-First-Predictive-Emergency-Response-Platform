@echo off
title DisasterSync Installer & Launcher
color 0f

echo ==================================================
echo       DISASTERSYNC - SYSTEM STARTUP
echo ==================================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is NOT detected in your PATH.
    echo Please install Node.js from https://nodejs.org/ and RESTART this terminal.
    echo.
    pause
    exit
)

echo [1/4] Installing Server Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install server dependencies.
    pause
    exit
)

echo.
echo [2/4] Starting Backend Server...
start "DisasterSync Backend Operations" npm start
cd ..

echo.
echo [3/4] Installing Client Dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install client dependencies.
    pause
    exit
)

echo.
echo [4/4] Starting Frontend Dashboard...
echo.
echo The application should open in your browser shortly...
echo Press Ctrl+C to stop the frontend.
echo.
npm run dev
