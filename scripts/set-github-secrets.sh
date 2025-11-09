#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/set-github-secrets.sh <owner/repo>
# Requires GitHub CLI 'gh' installed and authenticated with repo admin rights.

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <owner/repo>"
  exit 2
fi

REPO="$1"

# Expect these files/vars locally (or you can export them before running)
# - serviceAccountKey.json in current dir
# - VITE_FIREBASE_* env vars exported or present in .env.production

if [ ! -f serviceAccountKey.json ]; then
  echo "serviceAccountKey.json not found in current directory. Create it or place it here." >&2
  exit 2
fi

# Encode service account
SA_B64=$(cat serviceAccountKey.json | base64 | tr -d '\n')

echo "Setting secrets on repository: $REPO"

# Set secrets using gh
gh secret set FIREBASE_SERVICE_ACCOUNT_KEY -b "$SA_B64" -R "$REPO"

gh secret set FIREBASE_PROJECT_ID -b "$(jq -r .project_id serviceAccountKey.json)" -R "$REPO"

# Other env vars - prompt for values if not set
read -rp "VITE_FIREBASE_API_KEY: " VITE_FIREBASE_API_KEY
gh secret set VITE_FIREBASE_API_KEY -b "$VITE_FIREBASE_API_KEY" -R "$REPO"

read -rp "VITE_FIREBASE_AUTH_DOMAIN: " VITE_FIREBASE_AUTH_DOMAIN
gh secret set VITE_FIREBASE_AUTH_DOMAIN -b "$VITE_FIREBASE_AUTH_DOMAIN" -R "$REPO"

read -rp "VITE_FIREBASE_STORAGE_BUCKET: " VITE_FIREBASE_STORAGE_BUCKET
gh secret set VITE_FIREBASE_STORAGE_BUCKET -b "$VITE_FIREBASE_STORAGE_BUCKET" -R "$REPO"

read -rp "VITE_FIREBASE_MESSAGING_SENDER_ID: " VITE_FIREBASE_MESSAGING_SENDER_ID
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID -b "$VITE_FIREBASE_MESSAGING_SENDER_ID" -R "$REPO"

read -rp "VITE_FIREBASE_APP_ID: " VITE_FIREBASE_APP_ID
gh secret set VITE_FIREBASE_APP_ID -b "$VITE_FIREBASE_APP_ID" -R "$REPO"

echo "All secrets set."
