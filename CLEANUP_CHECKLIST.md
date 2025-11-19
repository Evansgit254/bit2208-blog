# Project Cleanup Checklist

## ⚠️ Files to Remove (Security & Cleanup)

### 1. Security-Sensitive Files
- [ ] `serviceAccountKey.json` - **CRITICAL**: Remove if exists (contains sensitive credentials)
- [ ] `firestore-debug.log` - Debug log file (should not be committed)

### 2. Duplicate/Misplaced Files in src/
These files belong in the `functions/` directory and are duplicates:
- [ ] `src/package.json`
- [ ] `src/package-lock.json`
- [ ] `src/.eslintrc.js`
- [ ] `src/.gitignore`
- [ ] `src/tsconfig.json`
- [ ] `src/tsconfig.dev.json`
- [ ] `src/node_modules/` - **ENTIRE DIRECTORY**
- [ ] `src/src/` - **ENTIRE DIRECTORY**

### 3. Test Artifacts (Optional - can be gitignored)
- [ ] `test-results/` - Playwright test results
- [ ] `playwright-report/` - Playwright HTML reports

## ✅ Cleanup Commands

Run these commands to clean up the project:

```bash
# Remove security-sensitive files
rm -f serviceAccountKey.json
rm -f *-firebase-adminsdk-*.json
rm -f firestore-debug.log

# Remove duplicate function files from src/
rm -f src/package.json
rm -f src/package-lock.json
rm -f src/.eslintrc.js
rm -f src/.gitignore
rm -f src/tsconfig.json
rm -f src/tsconfig.dev.json

# Remove duplicate directories
rm -rf src/node_modules
rm -rf src/src

# Remove test artifacts (optional)
rm -rf test-results
rm -rf playwright-report

# Clean and reinstall dependencies
npm ci
```

## 📋 Post-Cleanup Verification

After cleanup, verify:
1. `npm run build` - Should build successfully
2. `npm test` - Should run tests successfully
3. `npm run lint` - Should pass linting
4. Check that no sensitive files are tracked by git: `git status`

## 🔒 Security Notes

- The `.gitignore` has been updated to prevent committing sensitive files
- Always use `.env` files for configuration (never commit them)
- Service account keys should only exist locally and in CI/CD secrets
