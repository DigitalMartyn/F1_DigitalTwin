#!/bin/bash

# F1 Race Replay - Start Script
# This script starts both the backend and frontend servers

echo "🏎️  Starting F1 Race Replay..."
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in background
echo "🚀 Starting backend server on port 8000..."
.venv/bin/python backend/main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🚀 Starting frontend server on port 5173..."
cd frontend
npm run dev

# Cleanup: kill backend when frontend stops
kill $BACKEND_PID
