#!/usr/bin/env bash
set -e
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install the LTS version from https://nodejs.org then run again."; exit 1
fi
echo "Node $(node -v)"
npm install
echo "Setup complete! Opening http://localhost:3000"
npm run dev
