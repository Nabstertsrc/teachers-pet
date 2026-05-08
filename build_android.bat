@echo off
echo Starting Teacher's Pet Android Build Process...
echo.

echo [1/4] Building web assets...
call npm run build

echo.
echo [2/4] Initializing Capacitor platform...
if exist "android" (
    echo Android platform already exists, syncing instead...
    call npx cap sync
) else (
    call npx cap add android
)
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to initialize Android platform.
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [3/4] Building Android APK (This might take a while)...
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
