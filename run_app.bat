@echo off
title ColorAI Studio Launcher
echo ========================================================
echo        Starting ColorAI Studio (AI Image Colorization)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:5000...
start "ColorAI Backend (FastAPI)" cmd /k "python -m uvicorn app:app --host 127.0.0.1 --port 5000"

echo [2/2] Launching React Vite Frontend on http://localhost:5173...
cd frontend
start "ColorAI Frontend (Vite)" cmd /k "npm run dev"

echo.
echo Both servers are launching!
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ColorAI Studio is live! Keep the backend/frontend command windows open.
