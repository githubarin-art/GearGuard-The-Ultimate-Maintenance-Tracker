# Quick Start Script for GearGuard

Write-Host "🚀 Starting GearGuard Setup..." -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB tools are available (optional)
Write-Host "`n🍃 Checking MongoDB tools (mongod/mongo)..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version
    Write-Host "✓ MongoDB available: $mongoVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ MongoDB not found locally. If using Atlas, ensure MONGO_URI is set in .env" -ForegroundColor Yellow
}

# Check if .env file exists
Write-Host "`n⚙ Checking configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠ .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created. Please update it with your database credentials." -ForegroundColor Green
}

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB is running or set MONGO_URI to your Atlas cluster" -ForegroundColor White
Write-Host "2. Update .env file with MONGO_URI (e.g., mongodb://localhost:27017/gearguard)" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the application" -ForegroundColor White
Write-Host "4. Run 'npm run dev' to start the application" -ForegroundColor White
Write-Host "`n🌐 URLs:" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "`n💡 To start now, run: npm run dev" -ForegroundColor Yellow
