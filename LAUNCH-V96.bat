@echo off
cd /d "%~dp0"
echo Iggy Meadow v96 - Short Pages Launch
echo.
where node >nul 2>nul
if errorlevel 1 goto :node_missing
if not exist .env.local goto :env_missing
call node scripts/check-launch.cjs
if errorlevel 1 goto :fail
call npm ci --no-audit --no-fund
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
echo.
echo Build succeeded. Open http://localhost:3000 in your browser.
echo Keep this window open while you play. Ctrl+C stops the server.
call npm run start
if errorlevel 1 goto :fail
exit /b 0
:node_missing
echo Install Node.js 24 LTS, reopen this shortcut, and try again.
pause
exit /b 1
:env_missing
echo Copy your working .env.local from your successful Iggy Meadow version into this folder.
echo See START-HERE-V96.md for details.
pause
exit /b 1
:fail
echo Launch stopped. The error above explains what needs fixing.
pause
exit /b 1
