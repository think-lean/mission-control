#!/bin/bash

echo "🚀 Setting up Mission Control..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🔐 Setting up Convex..."
echo "You'll need to:"
echo "1. Log in to Convex (or create an account)"
echo "2. Create a new project called 'mission-control'"
echo ""
echo "Running: npx convex dev"
npx convex dev
