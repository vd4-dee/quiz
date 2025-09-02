# start-dev.ps1
# Start PocketBase development server with sample data

Write-Host "Starting PocketBase Development Server..." -ForegroundColor Green

# Change to backend directory
Set-Location $PSScriptRoot

# Check if PocketBase is already running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8090/api/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "PocketBase is already running!" -ForegroundColor Yellow
    Write-Host "Admin UI: http://localhost:8090/_/" -ForegroundColor Cyan
    Write-Host "API Base: http://localhost:8090/api/" -ForegroundColor Cyan
    exit 0
} catch {
    Write-Host "PocketBase not running, starting server..." -ForegroundColor Blue
}

# Start PocketBase server in background with LAN access
Write-Host "Starting PocketBase server with LAN access..." -ForegroundColor Blue
$pbProcess = Start-Process -FilePath ".\pocketbase.exe" -ArgumentList "serve", "--http=0.0.0.0:8090" -PassThru -NoNewWindow

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check if server started successfully
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8090/api/health" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "PocketBase server started successfully!" -ForegroundColor Green
        break
    } catch {
        if ($i -eq 10) {
            Write-Host "Failed to start PocketBase server" -ForegroundColor Red
            if ($pbProcess -and !$pbProcess.HasExited) {
                $pbProcess.Kill()
            }
            exit 1
        }
        Write-Host "Waiting for server... (attempt $i/10)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

# Check if we need to populate sample data
Write-Host "Checking for sample data..." -ForegroundColor Blue

try {
    # Try to fetch questions
    $questionsResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/collections/questions/records" -Method GET
    $questionCount = $questionsResponse.items.Count
    
    # Try to fetch quizzes
    $quizzesResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/collections/quizzes/records" -Method GET
    $quizCount = $quizzesResponse.items.Count
    
    Write-Host "Found $questionCount questions and $quizCount quizzes" -ForegroundColor Cyan
    
    if ($questionCount -eq 0 -or $quizCount -eq 0) {
        Write-Host "Populating sample data..." -ForegroundColor Blue
        
        if ($questionCount -eq 0) {
            Write-Host "Adding sample questions..." -ForegroundColor Gray
            node sample-data.js
        }
        
        if ($quizCount -eq 0) {
            Write-Host "Adding sample quizzes..." -ForegroundColor Gray
            node sample-quizzes.js
        }
        
        Write-Host "Sample data populated!" -ForegroundColor Green
    } else {
        Write-Host "Sample data already exists!" -ForegroundColor Green
    }
} catch {
    Write-Host "Could not check sample data (collections may not exist yet)" -ForegroundColor Yellow
    Write-Host "You may need to run migrations first" -ForegroundColor Gray
}

Write-Host ""
Write-Host "PocketBase Development Server Ready!" -ForegroundColor Green
Write-Host "Admin UI: http://localhost:8090/_/" -ForegroundColor Cyan
Write-Host "API Base: http://localhost:8090/api/" -ForegroundColor Cyan
Write-Host "Collections: questions, quizzes, submissions, users" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 LAN Access Information:" -ForegroundColor Yellow
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"} | Select-Object -First 1).IPAddress
if ($localIP) {
    Write-Host "   LAN Admin UI: http://$localIP`:8090/_/" -ForegroundColor Green
    Write-Host "   LAN API Base: http://$localIP`:8090/api/" -ForegroundColor Green
} else {
    Write-Host "   Could not detect LAN IP address" -ForegroundColor Red
}
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 10
        if ($pbProcess.HasExited) {
            Write-Host "PocketBase server has stopped" -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host "Stopping PocketBase server..." -ForegroundColor Yellow
    if ($pbProcess -and !$pbProcess.HasExited) {
        $pbProcess.Kill()
    }
}
