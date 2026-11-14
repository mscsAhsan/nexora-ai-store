@echo off
title Nexora AI - Setup
echo ==========================================
echo   Nexora AI Store - Auto Setup
echo ==========================================
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Node.js is not installed.
  echo Download the LTS version from https://nodejs.org , install it,
  echo then double-click setup.bat again.
  echo.
  pause
  exit /b 1
)
echo Node version:
node -v
echo.
echo Installing libraries (first time takes 1-3 minutes)...
call npm install
if %errorlevel% neq 0 (
  echo [ERROR] npm install failed. Check your internet and try again.
  pause
  exit /b 1
)
echo.
echo Setup complete! Starting website at http://localhost:3000
start "" http://localhost:3000
call npm run dev
pause
