# BIT2208 Blog - Complete Implementation Roadmap

# Bit2208 Blog

Offline-first blog built with React + TypeScript + Vite, Tailwind CSS, Firebase for auth/storage, and sql.js for local persistence.

Features
- Offline-first: local SQLite (sql.js) persisted to localStorage
- Two-way sync with Firebase (Firestore + Storage)
- Markdown editor with preview and syntax highlighting
- Authentication via Firebase Auth
- Image uploads to Firebase Storage

Quick start

1. Install dependencies

```bash
npm ci
```

2. Provide environment variables (for development). Create a `.env` file at project root with Vite env keys:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Run dev server

```bash
npm run dev
```

Build

```bash
npm run build
```

Tests

```bash
npm test
```

Lint

```bash
npm run lint
```

Deploy (Firebase Hosting)

1. Install Firebase CLI and login

```bash
npm i -g firebase-tools
firebase login
```

2. Build and deploy

```bash
npm run build
firebase deploy --only hosting
```

Deploy helper

A simple helper script is included at `deploy.sh`:

```bash
./deploy.sh
```

CI

A GitHub Actions workflow is present at `.github/workflows/ci.yml` that runs lint, build, and tests on pushes and PRs. To enable automated deploys from CI, add a `FIREBASE_SERVICE_ACCOUNT` secret and uncomment the deploy step in the workflow.

Security & Firestore rules

Starter `firestore.rules` and `storage.rules` are included. Review and harden them before production.

Notes

- Tests use centralized mocks in `src/setupTests.ts` to avoid loading ESM-only dependencies in Jest.
- Build bundle contains large chunks; consider code-splitting for production.

If you'd like, I can now:
- Add an automated deploy step to CI (requires secrets), or
- Harden Firestore rules to more strictly match the data model.

Which should I do next? (I'll proceed autonomously if you prefer.)

CI automated deploy (how-to)

To enable automatic deploys from GitHub Actions you need to add a Firebase service account JSON as a repository secret.

1. Create a service account in your Firebase project (IAM & Admin) with permission to deploy to Hosting (role `Firebase Hosting Admin` or `Editor` + `Storage Admin` as needed).
2. Generate a key (JSON) for that service account and copy its contents.
3. In the GitHub repo: Settings → Secrets and variables → Actions → New repository secret. Name it `FIREBASE_SERVICE_ACCOUNT` and paste the JSON value.

The CI workflow contains a conditional deploy step which will run on pushes to `main` only when that secret exists. The action expects the secret value (JSON) directly.

Security note: never commit service account JSON to the repository. Use GitHub repository or org secrets.
