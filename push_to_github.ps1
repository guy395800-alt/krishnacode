# Refresh environment PATH for Git
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") + ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Pushing NexGenCode to GitHub Repository" -ForegroundColor Cyan
Write-Host " Target: https://github.com/guy395800-alt/krishnacode" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Initialize git
if (-not (Test-Path ".git")) {
    Write-Host "==> Initializing Git repository..." -ForegroundColor Yellow
    git init
}

# 2. Add all files (respects .gitignore)
Write-Host "==> Staging all project files..." -ForegroundColor Yellow
git add .

# 3. Commit
Write-Host "==> Creating commit..." -ForegroundColor Yellow
git commit -m "Complete React/Next.js frontend with exam workspace, problem solver, and deployment configs"

# 4. Set branch and remote
Write-Host "==> Setting main branch and origin..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/guy395800-alt/krishnacode.git

# 5. Push to GitHub
Write-Host "==> Pushing to origin main..." -ForegroundColor Yellow
git push -u origin main

Write-Host "==> Done! Successfully pushed to https://github.com/guy395800-alt/krishnacode" -ForegroundColor Green
