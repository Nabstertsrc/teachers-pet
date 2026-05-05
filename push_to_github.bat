@echo off
SET /P REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/username/repo.git): "

echo Initializing Git...
git init

echo Adding files...
git add .

echo Creating initial commit...
git commit -m "Initial commit of Teacher's Pet App"

echo Setting branch to main...
git branch -M main

echo Adding remote origin...
git remote add origin %REPO_URL%

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! If you see errors, make sure you created the repository on GitHub first.
pause
