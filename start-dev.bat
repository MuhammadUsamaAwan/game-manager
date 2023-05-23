@echo off
start cmd /k "npm run dev"
timeout 5
start "" "http://localhost:3000"
