@echo off
echo =======================================================================
echo          Starting Kaushal Setu (कौशल सेतु) MVP
echo =======================================================================
echo.
echo [1/2] Starting Backend API Server (FastAPI on http://127.0.0.1:8000)...
start "Kaushal Setu Backend" cmd /k "python backend/run.py"

echo [2/2] Starting Frontend Dev Server (Vite on http://localhost:5173)...
start "Kaushal Setu Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching!
echo Backend Docs: http://127.0.0.1:8000/docs
echo Frontend App: http://localhost:5173
echo.
pause
