#!/bin/bash

# Ocean Dreams interactive gallery - local server launcher

echo "Starting the Ocean Dreams interactive gallery..."
echo ""
echo "Opening the local development server..."
echo ""

# Detect available Python version
if command -v python3 &> /dev/null; then
    echo "Using Python 3"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python 2"
    python -m SimpleHTTPServer 8000
else
    echo "Python is not installed. Please install Python or start a server manually."
    echo ""
    echo "Alternatives:"
    echo "1. Node.js: npx http-server -p 8000"
    echo "2. PHP: php -S localhost:8000"
    exit 1
fi
