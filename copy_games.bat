@echo off
echo 🎮 Copying Brain Games to Teacher's Pet...

set SOURCE=C:\Users\user\Documents\Corvexis\public
set TARGET=c:\Users\user\Documents\Teachers pet\public

echo.
echo [1/3] Copying Fluffy Jump...
xcopy "%SOURCE%\fluffy-jump" "%TARGET%\fluffy-jump" /E /I /Y

echo.
echo [2/3] Copying Word Quest...
xcopy "%SOURCE%\word-quest" "%TARGET%\word-quest" /E /I /Y

echo.
echo [3/3] Copying Snake Game...
xcopy "%SOURCE%\snake-game" "%TARGET%\snake-game" /E /I /Y

echo.
echo ✅ Games copied! You can now access them in the Student Hub.
pause
