# Quick Reference Guide

## 🚀 Common Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Testing
```bash
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:e2e:ci      # Run E2E tests in CI mode
npm run ci               # Run all checks (lint + tests)
```

### Firebase
```bash
npm run emulators:start  # Start Firebase emulators
npm run emulators:stop   # Stop Firebase emulators
firebase deploy          # Deploy to Firebase
./deploy.sh             # Deploy using helper script
```

## 📁 Project Structure

```
bit2208-blog/
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── services/       # Business logic
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   └── utils/          # Utilities
├── public/             # Static assets
├── docs/               # Documentation
├── e2e/                # E2E tests
├── functions/          # Firebase Functions
└── dataconnect/        # Firebase Data Connect
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Development environment variables |
| `.env.example` | Environment template |
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `firebase.json` | Firebase configuration |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Storage security rules |

## 🌐 Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 Key Dependencies

### Production
- `react` - UI framework
- `react-router-dom` - Routing
- `firebase` - Backend services
- `sql.js` - Local database
- `react-markdown` - Markdown rendering
- `lucide-react` - Icons

### Development
- `vite` - Build tool
- `typescript` - Type checking
- `tailwindcss` - Styling
- `jest` - Unit testing
- `playwright` - E2E testing
- `eslint` - Linting

## 🔑 Important Paths

### Routes
- `/` - Home page (post list)
- `/login` - Login page
- `/new` - Create new post
- `/post/:id` - View post
- `/edit/:id` - Edit post
- `/about` - About page

### API Endpoints (Firebase)
- `firestore.collection('posts')` - Posts collection
- `firestore.collection('users')` - Users collection
- `storage.ref('posts/{postId}')` - Post images

## 🛠️ Useful Code Snippets

### Create a New Component
```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Use Auth Hook
```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <div>Welcome, {user.email}</div>;
}
```

### Create a Post
```typescript
import { createPost } from '../services/sqliteAdapter';

const newPost = await createPost({
  title: 'My Post',
  content: 'Content here',
  authorId: user.uid,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Firebase Errors
```bash
# Re-login to Firebase
firebase logout
firebase login

# Check project
firebase projects:list
firebase use <project-id>
```

### Test Failures
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests in verbose mode
npm test -- --verbose
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

## 🔒 Security Checklist

- [ ] Never commit `.env` files
- [ ] Never commit `serviceAccountKey.json`
- [ ] Use environment variables for secrets
- [ ] Review Firestore rules before deploy
- [ ] Review Storage rules before deploy
- [ ] Enable Firebase App Check (production)
- [ ] Set up Firebase security alerts

## 📊 Performance Tips

- Use React.memo for expensive components
- Implement code splitting with lazy loading
- Optimize images before upload
- Use Firestore indexes for queries
- Enable Firebase caching
- Monitor bundle size

## 🎨 Styling Guidelines

### Tailwind Classes
```tsx
// Layout
<div className="container mx-auto px-4">

// Buttons
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">

// Cards
<div className="bg-white shadow-md rounded-lg p-6">

// Forms
<input className="border border-gray-300 rounded px-3 py-2 w-full">
```

## 🧪 Testing Patterns

### Unit Test
```typescript
describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### E2E Test
```typescript
test('user can create post', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
});
```

## 📚 Documentation Links

- [Main README](README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Contributing](CONTRIBUTING.md)
- [Deployment](docs/deployment.md)
- [Firebase Setup](docs/firebase-setup.md)

## 🆘 Getting Help

1. Check documentation first
2. Search existing issues on GitHub
3. Check Firebase documentation
4. Open a new issue with details
5. Include error messages and steps to reproduce

## 📞 Quick Links

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)
