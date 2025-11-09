# Deployment Guide

## Deployment Checklist

### 1. Environment Setup
- [ ] Create `.env.production` with production Firebase credentials
- [ ] Verify all required environment variables are set
- [ ] Remove development `.env` from git history
- [ ] Update CI/CD environment variables

### 2. Testing Requirements
- [ ] Run all unit tests (`npm test`)
- [ ] Run all E2E tests (`npm run test:e2e:ci`)
- [ ] Verify test coverage meets requirements
- [ ] Fix any failing tests

### 3. Firebase Configuration
- [ ] Set up production Firebase project
- [ ] Review and update Firestore security rules
- [ ] Review and update Storage security rules
- [ ] Configure Firebase hosting and domain
- [ ] Set up Firebase service account for CI/CD

### 4. Build Verification
- [ ] Run production build (`npm run build`)
- [ ] Test built app with production config
- [ ] Verify all assets are included
- [ ] Check bundle size and optimization

### 5. Deployment Process
- [ ] Run deployment script (`./deploy.sh`)
- [ ] Verify deployment succeeds
- [ ] Test deployed application
- [ ] Monitor for any errors

## Environment Setup

### Production Environment
Create `.env.production` with real values:
```env
VITE_FIREBASE_API_KEY=prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=prod_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prod_project_id
VITE_FIREBASE_STORAGE_BUCKET=prod_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
VITE_FIREBASE_APP_ID=prod_app_id
NODE_ENV=production
```

### CI/CD Environment
Required secrets in CI:
- `FIREBASE_TOKEN`: Deploy access
- `FIREBASE_PROJECT_ID`: Production project
- All production environment variables

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Blog posts
    match /posts/{postId} {
      allow read: if true;  // Public reading
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.authorId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{postId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Deployment Steps

1. **Preparation**:
   ```bash
   # Update to latest dependencies
   npm update
   
   # Clean install
   rm -rf node_modules
   npm ci
   
   # Run all tests
   npm run test
   npm run test:e2e:ci
   ```

2. **Build**:
   ```bash
   # Production build
   npm run build
   ```

3. **Deploy**:
   ```bash
   # Using deploy script
   ./deploy.sh
   
   # Manual deployment
   firebase deploy --project $FIREBASE_PROJECT_ID
   ```

## Post-Deployment Verification

1. **Application Checks**:
   - [ ] Homepage loads
   - [ ] Authentication works
   - [ ] Can create/edit/delete posts
   - [ ] Images upload successfully
   - [ ] Markdown preview works
   - [ ] Search functions properly

2. **Performance Checks**:
   - [ ] Lighthouse score
   - [ ] Page load times
   - [ ] Image optimization
   - [ ] Bundle size

3. **Error Monitoring**:
   - [ ] Error reporting configured
   - [ ] Performance monitoring enabled
   - [ ] Usage metrics tracking

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version matches engine requirement
   - Verify all dependencies are installed
   - Check for TypeScript errors
   - Verify environment variables

2. **Deployment Failures**:
   - Check Firebase token is valid
   - Verify project ID is correct
   - Check Firebase quota and billing
   - Verify hosting configuration

3. **Runtime Errors**:
   - Check browser console for errors
   - Verify environment variables are set
   - Check Firebase security rules
   - Verify API access and permissions

### Rollback Procedure

1. **Quick Rollback**:
   ```bash
   # List available versions
   firebase hosting:versions:list
   
   # Rollback to previous version
   firebase hosting:clone VERSION_ID:live
   ```

2. **Manual Rollback**:
   - Deploy previous known-good version
   - Verify rollback success
   - Investigate root cause

## Monitoring and Maintenance

1. **Regular Checks**:
   - Monitor error rates
   - Check performance metrics
   - Review security logs
   - Update dependencies

2. **Backup Procedures**:
   - Regular Firestore exports
   - Configuration backups
   - Environment documentation

3. **Update Procedures**:
   - Schedule maintenance windows
   - Communicate changes
   - Test updates in staging
   - Deploy during low-traffic periods