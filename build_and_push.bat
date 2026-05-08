@echo off
echo 🚀 Starting Build and Push Process...

echo.
echo [1/3] Installing dependencies (just in case)...
call npm install

echo.
echo [2/3] Building and Deploying to GitHub Pages...
call npm run deploy

echo.
echo [3/3] Checking Git status and pushing source code...
git status
git add --all
git commit -m "Add Career Tools, University Hub, and deployment update"
git push origin main

echo.
echo ✅ Done! Your application is built and pushed to GitHub.
pause
