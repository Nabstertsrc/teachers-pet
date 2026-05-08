@echo off
echo 🚀 Starting Build and Push Process...

echo.
echo [1/3] Installing dependencies (just in case)...
call npm install

echo.
echo [2/3] Building the production application...
call npm run build

echo.
echo [3/3] Pushing changes to GitHub...
git add .
git commit -m "Add Career Tools, University Hub, and PDF optimization"
git push origin main

echo.
echo ✅ Done! Your application is built and pushed to GitHub.
pause
