# Deployment script for Vercel
Write-Host "🚀 Starting Vercel Deployment..." -ForegroundColor Green

# Check if Vercel is installed
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelPath) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Change to backend directory
Set-Location "e:\website\Chandni-Jewellery-Backend-main"

# Deploy to Vercel
Write-Host "Deploying backend to Vercel..." -ForegroundColor Cyan
& vercel deploy --prod --yes --name "chandni-backend"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
    
    # Get the deployment URL
    $url = & vercel url
    Write-Host "🌐 Backend URL: $url" -ForegroundColor Cyan
    
    # Return to root
    Set-Location "e:\website"
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
}
