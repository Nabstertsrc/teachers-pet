@echo off
echo Starting Teacher's Pet Setup...
echo.
echo [1/2] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: npm install failed. Make sure Node.js and npm are installed.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [2/2] Starting development server...
echo The app will be available at http://localhost:5173
echo.
npm run dev
pause
