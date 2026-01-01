# Refresh Environment Variables from Registry
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Write-Host "Environment Refreshed."

# Check for Node
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js found: $nodeVersion"
    $npmVersion = npm -v
    Write-Host "✅ npm found: $npmVersion"
} catch {
    Write-Error "❌ Node.js is still not accessible. Please restart your computer."
    exit 1
}

# Install and Start Server
Write-Host "🚀 Starting DisasterSync..."

# We use Start-Process to open independent windows so the agent doesn't hang waiting for them
Start-Process cmd -ArgumentList "/k title DisasterSync_Backend && cd server && npm install && npm start"
Start-Process cmd -ArgumentList "/k title DisasterSync_Frontend && cd client && npm install && npm run dev"

Write-Host "✅ Application Launch Initiated."
