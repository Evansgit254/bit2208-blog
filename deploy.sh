#!/usr/bin/env bash
set -euo pipefail

# Simple deploy helper for Firebase Hosting.
# Usage:
#   ./deploy.sh            # run interactively (requires firebase-tools login)
#   CI usage: configure Firebase service account per CI provider

echo "Building project..."
npm run build

if ! command -v firebase >/dev/null 2>&1; then
  echo "firebase CLI not found. Install with: npm i -g firebase-tools" >&2
  exit 1
fi

# If FIREBASE_PROJECT env is set, use it; otherwise rely on .firebaserc default
PROJECT_ARG=""
if [ -n "${FIREBASE_PROJECT:-}" ]; then
  PROJECT_ARG="--project $FIREBASE_PROJECT"
fi

echo "Deploying to Firebase Hosting..."
# This will prompt for login if not authenticated
firebase deploy $PROJECT_ARG --only hosting

echo "Deploy complete."
