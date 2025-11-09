# Firebase Production Setup

Steps to create the production Firebase project and service account used for CI/CD deployments.

## 1) Create a Firebase project

1. Go to https://console.firebase.google.com/
2. Click "Add project" and follow the prompts.
3. Enable the following products if used by the app:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Hosting

## 2) Configure project settings

1. In Project Settings -> General, copy the Firebase config values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
2. Add them to a local `.env.production` file (do not commit):

```env
VITE_FIREBASE_API_KEY=your_prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_prod_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_prod_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
NODE_ENV=production
```

## 3) Create a service account for CI/CD

1. Open the Firebase console -> Project settings -> Service accounts -> "Manage service accounts" (this opens Google Cloud IAM).
2. Click "Create Service Account".
   - Name: `ci-firebase-deployer`
   - ID: `ci-firebase-deployer`
3. Grant the service account the `Firebase Admin` role (or `Editor` if you need broader access) and `Storage Admin` if you need storage rule deployment.
4. Create a JSON key and download it. Keep this safe.

## 4) Add secrets to GitHub

We expect the CI workflow to use these secrets:
- `FIREBASE_SERVICE_ACCOUNT_KEY` — base64-encoded content of the service account JSON
- `FIREBASE_PROJECT_ID` — project id
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — production env values

Encode the service account JSON to base64 (macOS / Linux):

```bash
cat serviceAccountKey.json | base64 | tr -d '\n' > service_account_b64.txt
```

Then use one of these options to add the secret to GitHub:

- GitHub UI: Repository -> Settings -> Secrets -> Actions -> New repository secret
  - Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
  - Value: paste the contents of `service_account_b64.txt`

- GitHub CLI:

```bash
# Requires `gh` and that you're logged in and have repo admin rights
gh secret set FIREBASE_SERVICE_ACCOUNT_KEY --body-file=service_account_b64.txt
gh secret set FIREBASE_PROJECT_ID --body="your_prod_project_id"
gh secret set VITE_FIREBASE_API_KEY --body="your_prod_api_key"
# ... set the rest of env vars similarly
```

## 5) Update `.firebaserc`

Set the project id in `.firebaserc` or create `.firebaserc.production`:

```json
{
  "projects": { "default": "your_prod_project_id" }
}
```

## 6) Test a deployment locally (optional)

To test the deploy using the service account JSON locally (not recommended in plain text), you can use the Firebase CLI with the key:

```bash
# Authenticate with service account for this terminal session
gcloud auth activate-service-account --key-file=serviceAccountKey.json
# Then deploy
firebase deploy --project your_prod_project_id --only hosting
```

## Notes and security
- Never commit service account keys to the repository.
- Use GitHub Actions secrets for CI.
- Rotate the key if you suspect it was exposed.
- Use minimal IAM roles — do not grant owner unless necessary.

## Next steps
- Add the base64-encoded `FIREBASE_SERVICE_ACCOUNT_KEY` to GitHub secrets.
- Add the production environment variables to GitHub secrets.
- Ensure the CI workflow references `FIREBASE_SERVICE_ACCOUNT_KEY` (the current workflow uses `FIREBASE_SERVICE_ACCOUNT_KEY`).
