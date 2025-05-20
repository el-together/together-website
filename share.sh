#!/usr/bin/env bash
# Simple script to serve the current folder and expose it via a public HTTPS tunnel.
# Dependencies: python3 (builtin on macOS) and Node.js (for npx localtunnel)

PORT=8000

# ---------- Local static server ----------
# Start python's built-in web server in the background
python3 -m http.server "${PORT}" &
SERVER_PID=$!

echo "\nLocal server running on http://localhost:${PORT} (PID ${SERVER_PID})"

echo "\nOpening tunnel with localtunnel… (press Ctrl+C to stop)"

# ---------- HTTPS tunnel ----------
# Try localtunnel via npx first; if npx is missing, fall back to ssh / localhost.run
if command -v npx >/dev/null 2>&1; then
  echo "Using localtunnel (npx)…"
  npx --yes localtunnel --port "${PORT}" --print-requests
else
  echo "'npx' no encontrado. Usando fallback con ssh & localhost.run…"
  echo "Necesitarás aceptar la huella del servidor la primera vez."
  ssh -o StrictHostKeyChecking=accept-new -R 80:localhost:${PORT} nokey@localhost.run
fi

# When the user stops the tunnel (Ctrl+C), kill the python server too
kill "${SERVER_PID}"
