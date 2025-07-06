#!/bin/bash
# Change to the project directory
cd "$(dirname "$0")/Prakasam Personal Assistant"

# Start the Vite dev server in a new Terminal window
osascript <<EOF
tell application "Terminal"
    do script "npm run dev"
end tell
EOF

# Wait a few seconds for the server to start (adjust if needed)
sleep 5

# Open the app in the default browser (adjust port if needed)
open http://localhost:8080