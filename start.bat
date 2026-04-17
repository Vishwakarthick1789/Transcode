@echo off
echo Starting Lexa Translate Backend...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload"

echo Starting Lexa Translate Frontend...
start cmd /k "cd frontend && npm run dev"

echo ----------------------------------------------------
echo Services are starting in separate windows!
echo Make sure to keep those windows open.
echo Once fully loaded, open your browser to:
echo http://localhost:5173
echo ----------------------------------------------------
pause
