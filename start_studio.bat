@echo off
title Iydani Entertainment Studio Launcher
color 0e
echo ===================================================
echo   IYDANI ENTERTAINMENT - STUDIO WEBSITE LAUNCHER
echo ===================================================
echo.

:: Check for Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ to run this site.
    echo.
    pause
    exit /b 1
)

:: Check if node_modules folder exists
if not exist node_modules (
    echo [INFO] node_modules folder not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
)

echo [INFO] Launching local development server...
echo [INFO] The website will automatically open at http://localhost:5173/
echo.

:: Launch browser in background after a 2 second delay
start "" cmd /c "timeout /t 2 >nul && start http://localhost:5173"

:: Run backend server in a separate background window
start "Iydani Backend Server" cmd /c "node server.js"

:: Run dev server
call npm run dev

pause
