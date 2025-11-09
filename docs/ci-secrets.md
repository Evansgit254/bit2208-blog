# CI Secrets and Environment Setup

This document explains what secrets the CI workflow requires and how to add them to GitHub.

Required secrets (add in Settings → Secrets → Actions):

- `FIREBASE_SERVICE_ACCOUNT_KEY` — Base64 of the service account JSON file
- `FIREBASE_PROJECT_ID` — Firebase project id
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional secrets:
- `FIREBASE_SERVICE_ACCOUNT_EMAIL` — for reference

How to create the secrets (CLI):

1. Ensure you have the GitHub CLI installed and authenticated (`gh auth login`).
2. In your project root, ensure `serviceAccountKey.json` contains your downloaded service account key.
3. Run:

```bash
./scripts/set-github-secrets.sh your-org/your-repo
```

This will prompt you for the VITE_* values and set the repository secrets automatically.

How to create the secrets (UI):

1. Go to GitHub > your repo > Settings > Secrets & variables > Actions.
2. Click "New repository secret" and paste the base64-encoded service account JSON into `FIREBASE_SERVICE_ACCOUNT_KEY`.
3. Add the other VITE_* environment variables one-by-one.

Notes:
- The CI workflow expects the base64-encoded value for the service account key; the workflow decodes it at runtime.
- Do not commit the service account key or production `.env` file into the repository.
