@echo off
cd /d "%~dp0"
echo.
echo ==========================================
echo   Iggy Meadow v96 - Build Check
echo ==========================================
echo.
call npm ci --no-audit --no-fund
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
echo.
echo BUILD SUCCEEDED. You can now run START-V96.bat
pause
exit /b 0
:fail
echo.
echo BUILD FAILED. Copy the error output into ChatGPT.
pause
exit /b 1
