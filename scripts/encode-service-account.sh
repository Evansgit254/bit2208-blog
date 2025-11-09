#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /path/to/serviceAccountKey.json"
  exit 2
fi

KEYFILE="$1"
if [ ! -f "$KEYFILE" ]; then
  echo "Service account file not found: $KEYFILE"
  exit 2
fi

cat "$KEYFILE" | base64 | tr -d '\n'
