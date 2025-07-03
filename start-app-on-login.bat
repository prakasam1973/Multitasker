@echo off
REM Change directory to your project
cd /d "%~dp0\india-travel-schedule-sync"

REM Start the Vite dev server in a new terminal window
start cmd /k "npm run dev"

REM Wait a few seconds for the server to start (adjust if needed)
timeout /t 5 /nobreak > NUL

REM Open the app in the default browser (adjust port if needed)
start http://localhost:8080