@echo off
cls
echo ==========================================
echo   SHOPPING E-COMMERCE SERVER STARTER
echo ==========================================
echo.

REM Kill any existing processes on ports 3000 and 8000
echo Killing existing processes on ports 3000 and 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /F /PID %%a 2>nul
echo.

REM Start backend server
echo Starting backend server on port 3000...
cd backend
start "Backend Server" /MIN cmd /c "npm start ^> backend.log 2^>^&1"
cd ..
timeout /t 5 /nobreak >nul

REM Start frontend server
echo Starting frontend server on port 8000...
start "Frontend Server" /MIN cmd /c "python -m http.server 8000 ^> frontend.log 2^>^&1"
timeout /t 3 /nobreak >nul

echo.
echo ==========================================
echo SERVERS STARTED SUCCESSFULLY!
echo ==========================================
echo.
echo Backend API:    http://localhost:3000
echo Frontend Admin: http://localhost:8000/admin.html
echo.
echo To access the admin panel, open your browser and go to:
echo http://localhost:8000/admin.html
echo.
echo To stop the servers, close this window or press Ctrl+C
echo.
echo Logs are saved to backend.log and frontend.log
echo.

REM Keep the window open
pause