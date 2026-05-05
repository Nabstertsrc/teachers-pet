@echo off
echo Starting Teacher's Pet Android Build Process...
echo.

echo [1/3] Adding Android platform...
call npx cap add android
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to add Android platform. Make sure you ran 'npm install' first.
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [2/3] Syncing web assets...
call npx cap sync
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to sync Capacitor assets.
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [3/3] Building Android APK (This might take a while)...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Gradle build failed. Do you have Android Studio/SDK installed?
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..
echo.

echo =======================================================
echo SUCCESS: Android APK has been built successfully!
echo You can find your app-debug.apk in:
echo android\app\build\outputs\apk\debug\
echo =======================================================
pause
