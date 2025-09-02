@echo off
REM start-dev.bat
REM Start PocketBase development server with sample data

echo 🚀 Starting PocketBase Development Server...

REM Change to backend directory
cd /d "%~dp0"

REM Check if PocketBase is already running
curl -s http://localhost:8090/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PocketBase is already running!
    echo 🌐 Admin UI: http://localhost:8090/_/
    echo 📡 API Base: http://localhost:8090/api/
    pause
    exit /b 0
)

echo ℹ️ PocketBase not running, starting server...

REM Start PocketBase server
echo 🔧 Starting PocketBase server...
start /B pocketbase.exe serve

REM Wait for server to start
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak >nul

REM Check if server started successfully
for /L %%i in (1,1,10) do (
    curl -s http://localhost:8090/api/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ PocketBase server started successfully!
        goto :data_check
    )
    echo ⏳ Waiting for server... (attempt %%i/10)
    timeout /t 2 /nobreak >nul
)

echo ❌ Failed to start PocketBase server
pause
exit /b 1

:data_check
REM Check if we need to populate sample data
echo 🔍 Checking for sample data...

REM Try to populate sample data
echo 📝 Populating sample data...
node sample-data.js
node sample-quizzes.js

echo.
echo 🎉 PocketBase Development Server Ready!
echo 🌐 Admin UI: http://localhost:8090/_/
echo 📡 API Base: http://localhost:8090/api/
echo 📚 Collections: questions, quizzes, submissions, users
echo.
echo Press any key to stop the server
pause >nul

REM Stop PocketBase
taskkill /f /im pocketbase.exe >nul 2>&1
