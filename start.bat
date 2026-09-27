@echo off
title CampusCart - Next.js Framework & Standalone Runner
echo ===================================================
echo             CAMPUSCART FRAMEWORK RUNNER
echo    Verified Student Marketplace for BMSIT
echo ===================================================
echo.

where npm.cmd >nul 2>nul
if %errorlevel%==0 (
    echo [OK] Node.js and npm found.
    echo Starting Next.js Dev Server at http://localhost:3000 ...
    echo Opening browser at http://localhost:3000 ...
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:3000"
    call npm.cmd run dev
    goto end
)

where python >nul 2>nul
if %errorlevel%==0 (
    echo [OK] Python detected. Starting local HTTP server at http://localhost:3000 ...
    start "" "http://localhost:3000/homepageUI.html"
    python -m http.server 3000
    goto end
)

echo [INFO] Opening homepageUI.html directly in your default browser...
start "" "%~dp0public\homepageUI.html"

:end
pause
